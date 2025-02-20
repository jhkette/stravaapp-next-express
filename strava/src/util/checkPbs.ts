import { durations, distances } from "./values";
import { CyclingPbs, RunningPbs } from "@/types/types";
import { ActivityElement } from "@/types/activityElement";
/**
 * @function checkPbs
 * check to see if pb have improved
 * @param dataSet []
 * @param cyclingAllTime {}
 * @param runAllTime {}
 * @returns [] an array of alltime pbs with boolean flags to see if they have changed
 */
export function checkPbs(
  dataSet: ActivityElement[],
  cyclingAllTime: CyclingPbs,
  runAllTime: RunningPbs
) {
  let updateFlagCycling = false;
  let updateFlagRunning = false;
  let ftpChange = false;

  for (let activity of dataSet) {
    if (
      (activity.type === "Ride" || activity.type === "VirtualRide") &&
      activity.pbs
    ) {
      for (let duration of durations) {
        const key = duration.toString() as keyof CyclingPbs;

        if (activity.pbs[key] && cyclingAllTime[key]) {
          if (activity.pbs[key] > cyclingAllTime[key]) {
            if (key === "720" || key === "1200") {
              ftpChange = true;
            }
            updateFlagCycling = true;
            cyclingAllTime[key] = activity.pbs[key];
          }
        }
      }
    }

    if (activity.type === "Run" && activity.runpbs) {
      for (let distance of distances) {
        const key = distance.toString() as unknown as keyof RunningPbs;

        if (activity.runpbs[key] && runAllTime[key]) {
          if (activity.runpbs[key] < runAllTime[key]) {
            updateFlagRunning = true;
            runAllTime[key] = activity.runpbs[key];
          }
        }

        if (activity.runpbs[key] && !runAllTime[key]) {
          updateFlagRunning = true;
          runAllTime[key] = activity.runpbs[key];
        }
      }
    }
  }

  return [
    cyclingAllTime,
    runAllTime,
    updateFlagCycling,
    updateFlagRunning,
    ftpChange,
  ];
}
