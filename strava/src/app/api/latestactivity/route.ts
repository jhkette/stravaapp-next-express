import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import UserActivities from "@/models/UserActivities"; // Adjust import based on your project setup
import _ from "lodash";
import { activityLoop } from "@/util/addActvityData"; // Adjust the utility imports
import { calcFtp } from "@/util/ftpCalculation";
import { checkPbs } from "@/util/checkPbs";
import { calculateTss } from "@/util/calculateTss";


export async function GET(req: NextRequest) {
  const errors: Record<string, string> = {};
  const after = req.nextUrl.searchParams.get("after") as string;
  console.log(after, "activities ran");
  const token = req.headers.get("authorization");
  if (!token) {
    errors["error"] = "Permission not granted";
    return NextResponse.json(errors);
  }
  try {
    let response = await axios.get(
      `https://www.strava.com/api/v3/athlete/activities`,
      {
        headers: { Authorization: token },
        params: { after: after, page: 3 },
      }
    );
    if (response.data.length == 0) {
      errors["error"] = "no activities found";
      return NextResponse.json(errors);
    }

    const data_list = [...response.data];
    // console.log(data_list);

    const { id } = data_list[0].athlete;
    // equality check for latest actviity on mongo vs latest new activity
    const allActs = await UserActivities.findOne({ athlete_id: id });

    //the last activities to check its not the latest one.
    console.log( 
          //@ts-ignore 
      allActs?.activities[allActs.activities.length - 1].id ,
      data_list[data_list.length - 1].id)
    if (
    
      allActs?.activities[allActs.activities.length - 1].id ==
      data_list[data_list.length - 1].id
    ) {
      errors["error"] = "this activity has already been added";
      console.log("activity already added");
      return NextResponse.json(errors);
    }
    // get all extra data for each activities i.e watts, distance 'streams'
    const data_set = await activityLoop(data_list, token);

    // console.log(data_set, "THIS IS DATASET");
    /* checkPBs  = this is to check if there are new pbs - the helper function returns this destructured array */

    const [
      cyclingAllTime,
      runAllTime,
      updateFlagCycling,
      updateFlagRunning,
      ftpChange,
      //@ts-ignore
    ] = checkPbs(data_set, allActs.cyclingpbs, allActs.runningpbs);

    if (updateFlagCycling) {
      // if updatepb flag is true - update DB

      await UserActivities.updateOne(
        { athlete_id: id },
        {
          $set: {
            cyclingpbs: cyclingAllTime,
          },
        }
      );
    }

    if (updateFlagRunning) {
      // if updatepb flag is true - update DB

      await UserActivities.updateOne(
        { athlete_id: id },
        {
          $set: {
            runningpbs: runAllTime,
          },
        }
      );
    }

    if (ftpChange) {
      const amendedFTP = calcFtp(cyclingAllTime);
      // update ftp if needed
      await UserActivities.updateOne(
        { athlete_id: id },
        {
          $set: {
            cyclingFTP: amendedFTP,
          },
        }
      );
    }
    if (allActs) {
      //add tss score to each activity
      for (let element of data_set) {
        const finalTss = calculateTss(
          element,
          allActs.cyclingFTP as number,
          allActs.bikeHrZones,
          allActs.runHrZones
        );
        element["tss"] = finalTss;
      }
    }

    console.log(data_set, "THIS IS DATASET FOR LATEST ACTIVITY");

    await UserActivities.updateOne(
      { athlete_id: id },
      { $push: { activities: { $each: data_set } } }
    );

    return NextResponse.json(data_set);
  } catch (err) {
    console.log(err);
  }
}
