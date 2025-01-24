// libraries
import axios from "axios";
import _ from "lodash";
// helper functions
import { findMaxSubArray } from "./arraySorting";
import { ActivityElement } from "../types/activityElement";

import { runDistance, getShortestSubarray } from "./runSorting";
import { durations, distances } from "./values";
import { sleep } from "./sleep";
import { checkForTimeError } from "./timeErrorCheck";

/**
 * This funtion takes activities in an array and then call the
 * strava api for extra infomration on those activities if neccesarray.
 * this is only needed for watts stream data or run data - both of which return a long array
 * of number representing speed/watts/ distance travelled per second on the activity.
 * @function activityLoop
 * @param data_set[], @param token String
 *  @returns data_set []
 */
export async function activityLoop(
  data_set: ActivityElement[],
  token: string
) {
  let calls = 10; // we have already made at least 8 calls - err on side of safety
  for (let element of data_set) {
    if (calls === 90) {
      await sleep();
      calls = 0;
    }
    // ride block
    if (element["type"] == "Ride" || element["type"] == "VirtualRide") {
      if (element["device_watts"]) {
        let watts = await axios.get(
          `https://www.strava.com/api/v3/activities/${element.id}/streams?keys=watts,time&key_by_type=true&resolution=high`,
          { headers: { Authorization: token } }
        );
        calls++;
        if (watts["data"]["watts"]) {
          element["watt_stream"] = watts.data;
          const pbs = {
            "15": null,
            "30": null,
            "60": null,
            "90": null,
            "120": null,
            "150": null,
            "180": null,
            "210": null,
            "240": null,
            "270": null,
            "300": null,
            "330": null,
            "360": null,
            "390": null,
            "410": null,
            "440": null,
            "480": null,
            "600": null,
            "720": null,
            "900": null,
            "1200": null,
            "1800": null,
            "2700": null,
            "3600": null,
          };
          // checking there is time data for each second - some recording devices don't
          // if they don't i just return an empty pb array object as it interferes with accurate data
          const times = element["watt_stream"]["time"]["data"];
          const shouldBeFive = checkForTimeError(times);
          if (shouldBeFive === 5) {
            if (element["watt_stream"]["watts"]) {
              // this block gets power pbs
              for (let duration of durations) {
                const maxAverage = findMaxSubArray(
                  duration,
                  //@ts-ignore
                  element["watt_stream"]["watts"]["data"]
                );
                if (maxAverage) {
                  //@ts-ignore
                  pbs[duration] = maxAverage;
                }
              }
            }
          }

          element["pbs"] = pbs;
        }
      }
    }
    // run block
    if (element["type"] == "Run") {
      if (element["has_heartrate"]) {
        // this block gets run pbs
        let run = await axios.get(
          `https://www.strava.com/api/v3/activities/${element.id}/streams?keys=time,heartrate,velocity_smooth&key_by_type=true&resolution=high`,
          { headers: { Authorization: token } }
        );
        calls++;
        element["run_stream"] = run.data;
        const runpbs = {
          400: null,
          800: null,
          1000: null,
          2414: null,
          3000: null,
          5000: null,
          10000: null,
        };

        // checking there is time data for each second - some recording devices don't
        // if they don't i just return an empty pb array object as it interferes with accurate data.
        const times = element["run_stream"]["time"]["data"];
        const shouldBeFive = checkForTimeError(times);

        if (shouldBeFive === 5) {
          const runInMetres = runDistance(
            element["run_stream"]["distance"]["data"]
          );

          for (let distance of distances) {
            // gets quickest times
            const quickest = getShortestSubarray(runInMetres, distance);
            //@ts-ignore
            runpbs[distance] = quickest;
          }
        }
        element["runpbs"] = runpbs;
      }
    }
  }
  return data_set;
}