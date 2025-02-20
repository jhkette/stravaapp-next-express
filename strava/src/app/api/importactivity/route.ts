import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import UserActivities from "@/models/UserActivities"; // Adjust import based on your project setup
import _ from "lodash";
import {
  activityLoop,
 
} from "@/util/addActvityData"; // Adjust the utility imports
import {
  calcFtp
} from "@/util/ftpCalculation";

import {getHrZones, calcMaxHr} from "@/util/hrCalcualtion"
import {calculateTss} from "@/util/calculateTss"
// calculateTss,

export async function GET(req: NextRequest) {
  const token = req.headers.get("Authorization");
  console.log(token, "THIS IS TOKEN FROM IMPORT ACTIVITIES");

  const userId = req.headers.get("id");
  console.log(userId, "THIS IS USERID FROM IMPORT");

  if (!token) {
    return NextResponse.json({ error: "Permission not granted" }, { status: 401 });
  }

  // Check if activities already exist
  const foundUserActs = await UserActivities.findOne({ athlete_id: userId });
  if (foundUserActs && foundUserActs.activities.length > 5) {
    return NextResponse.json({ error: "Data has already been imported" }, { status: 409 });
  }

  let pageNum = 1;
  const dataList: any[] = [];

  try {
    // Fetch up to 200 activities (3 pages * 8 per page)
    while (pageNum <= 3) {
      const response = await axios.get(`https://www.strava.com/api/v3/athlete/activities`, {
        headers: { Authorization: token },
        params: { per_page: 8, page: pageNum },
      });

      console.log("LOOP RUNNING TO FETCH DATA", response.data[0]);

      dataList.push(...response.data);
      pageNum++;
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 });
  }

  // Process all activities
  const dataSet = await activityLoop(dataList, token);
  const allTime: Record<number, number> = {};
  const runAllTime: Record<number, number> = {};

  // Separate running and cycling activities
  const bikeActivities = dataSet.filter((activity) => "pbs" in activity);
  const runActivities = dataSet.filter((activity) => "runpbs" in activity);

  // Process cycling power PBs
  const durations = [15, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360, 390, 410, 440, 480, 600, 720, 900, 1200, 1800, 2700, 3600];
  for (const duration of durations) {
    const result = bikeActivities.map((activity) => activity.pbs?.[duration] ?? 0);
    allTime[duration] = _.max(result) || 0;
  }

  // Process running PBs
  const distances = [400, 800, 1000, 2414, 3000, 5000, 10000];
  for (const distance of distances) {
    const result = runActivities.map((activity) => activity.runpbs?.[distance] ?? Infinity);
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