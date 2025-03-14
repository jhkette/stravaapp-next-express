import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import UserActivities from "@/models/UserActivities"; // Adjust import based on your project setup
import { durations, distances } from "@/util/values";
import _ from "lodash";
import { activityLoop } from "@/util/addActvityData"; // Adjust the utility imports
import { calcFtp } from "@/util/ftpCalculation";
import { getHrZones, calcMaxHr } from "@/util/hrCalcualtion";
import { calculateTss } from "@/util/calculateTss";


export async function GET(req: NextRequest) {
  const token = req.headers.get("Authorization");
  const userId = req.headers.get("id");

  if (!token) {
    return NextResponse.json(
      { error: "Permission not granted" },
      { status: 401 }
    );
  }

  // Check if activities already exist
  const foundUserActs = await UserActivities.findOne({ athlete_id: userId });
  if (foundUserActs && foundUserActs.activities.length > 4) {
    return NextResponse.json(
      { error: "Data has already been imported" },
      { status: 409 }
    );
  }

  let pageNum = 1;
  const dataList: any[] = [];

  try {
    // Fetch up to 200 activities (3 pages * 8 per page)
    while (pageNum <= 3) {
      const response = await axios.get(
        `https://www.strava.com/api/v3/athlete/activities`,
        {
          headers: { Authorization: token },
          params: { per_page: 8, page: pageNum },
        }
      );

      // console.log("LOOP RUNNING TO FETCH DATA", response.data[0]);

      dataList.push(...response.data);
      pageNum++;
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    );
  }

  // Process all activities
  const dataSet = await activityLoop(dataList, token);
  // console.log(dataSet, "THIS IS DATALIST");
  //  let allTime, runAllTime;

  const allTime = durations.reduce<Record<number, null>>((acc, duration) => {
    acc[duration] = null;
    return acc;
  }, {});

  const runAllTime = distances.reduce<Record<number, null>>((acc, distance) => {
    acc[distance] = null;
    return acc;
  }, {});

  // Separate running and cycling activities
  const bikeActivities = dataSet.filter((activity) => "pbs" in activity);
  const runActivities = dataSet.filter((activity) => "runpbs" in activity);

  // Process cycling power PBs
  for (const duration of durations) {
    const result = bikeActivities.map(
      //@ts-ignore
      (activity) => activity.pbs[duration] ?? null
    );
    allTime[duration] = _.max(result) || 0;
  }

  for (const distance of distances) {
    const result = runActivities.map(
      //@ts-ignore
      (activity) => activity.runpbs[distance] ?? null
    );
    runAllTime[distance] = _.min(result) || 0;
  }

  // Compute metrics
  const ftp = calcFtp(allTime);
  const maxCyclingHr = calcMaxHr(bikeActivities, "ride");
  const runMaxHr = calcMaxHr(runActivities, "run");
  const bikeZones = getHrZones(maxCyclingHr);
  const runZones = getHrZones(runMaxHr);

  // Calculate TSS for each activity
  for (const activity of dataSet) {
    activity.tss = calculateTss(activity, ftp, bikeZones, runZones);
  }

  // Reverse activities to maintain chronological order
  dataSet.reverse();

  console.log(dataSet, "THIS IS DATA SET");

  // Update user activity data in MongoDB
  await UserActivities.findOneAndUpdate(
    { athlete_id: userId },
    {
      $push: { activities: { $each: dataSet } },
      $set: {
        cyclingpbs: allTime,
        runningpbs: runAllTime,
        bikeHrZones: bikeZones,
        runHrZones: runZones,
        cyclingFTP: ftp,
        cyclingMaxHr: maxCyclingHr,
        runningMaxHr: runMaxHr,
      },
    },
    { upsert: true }
  );

  return NextResponse.json({ message: "Successful import" }, { status: 200 });
}
