const _ = require("lodash");
const { quickSort } = require("./arraysorting");
import { ActivityElement } from "@/types/activityElement";
import { Activity } from "../types/types";


function calcMaxHr(performances: ActivityElement[], activityType: string): number {
  let hrList: ActivityElement[];
  if (activityType === "ride") {
    hrList = performances.filter(
      (performance) =>
        performance.type === "VirtualRide" || performance.type === "Ride"
    );
  } else {
    hrList = performances.filter((performance) => performance.type === "Run");
  }
  const hrNumbers: number[] = hrList
    .map((activity) => activity.max_heartrate)
    .filter((hr): hr is number => hr !== null && hr !== undefined);

  if (hrNumbers.length === 0) {
    return 0;
  }
  if (hrNumbers.length === 1) {
    return hrNumbers[0];
  }
  if (hrNumbers.length > 10) {
    const sortedHr = quickSort(hrNumbers);
    const quarterLength = Math.ceil(hrNumbers.length / 4);
    const higherIntensity = sortedHr.slice(quarterLength, sortedHr.length - 1);
    const mean = calcMean(higherIntensity);
    const standardDeviation = getStandardDeviation(higherIntensity);
    const outlierLimit = mean + 3 * standardDeviation;

    const removeHighOutliers = higherIntensity.filter((number: number) => number < outlierLimit);
    if (removeHighOutliers.length > 8) {
      return calcMean(removeHighOutliers.slice(-3));
    }
    return removeHighOutliers[removeHighOutliers.length - 1] || 0;
  }

  const mean = calcMean(hrNumbers);
  const standardDeviation = getStandardDeviation(hrNumbers);
  const outlierLimit = mean + 3 * standardDeviation;

  const removeHighOutliers = hrNumbers.filter((number) => number < outlierLimit);
  if (removeHighOutliers.length > 5) {
    return calcMean(removeHighOutliers.slice(-2));
  }
  return removeHighOutliers[removeHighOutliers.length - 1] || 0;
}

function calcMean(array: number[]): number {
  const n = array.length;
  if (n === 0) return 0;
  const mean = array.reduce((a, b) => a + b, 0) / n;
  return Math.ceil(mean);
}

function getStandardDeviation(array: number[]): number {
  const n = array.length;
  if (n === 0) return 0;
  const meanValue = calcMean(array);
  const variance = array.map((x) => Math.pow(x - meanValue, 2)).reduce((a, b) => a + b, 0) / n;
  return Math.sqrt(variance);
}

function getHrZones(hr: number): Record<string, [number, number]> {
  return {
    zone1: [Math.ceil(hr * 0.68), Math.ceil(hr * 0.73)],
    zone2: [Math.ceil(hr * 0.73), Math.ceil(hr * 0.8)],
    zone3: [Math.ceil(hr * 0.8), Math.ceil(hr * 0.87)],
    zone4: [Math.ceil(hr * 0.87), Math.ceil(hr * 0.93)],
    zone5: [Math.ceil(hr * 0.93), hr],
  };
}

export { calcMaxHr, getHrZones };
