const _ = require("lodash");
const { quickSort } = require("./arraysorting");

/**
 * Calculates max HR, removing obvious outliers
 * @param {Array} performances
 * @param {String} activityType
 * @returns {Number} max heart rate
 */
function calcMaxHr(performances, activityType) {
  const relevantActivities = performances.filter((activity) => {
    if (activityType === "ride") {
      return activity.type === "Ride" || activity.type === "VirtualRide";
    }
    return activity.type === "Run";
  });

  const hrValues = relevantActivities
    .map((activity) => activity.max_heartrate)
    .filter((hr) => hr); // filter out null or undefined HRs

  if (hrValues.length === 0) {
    return 0;
  }
  if (hrValues.length === 1) {
    return hrValues[0];
  }

  const filteredHrValues = removeOutliers(hrValues);

  if (filteredHrValues.length >= 8) {
    return calcMean(filteredHrValues.slice(-3));
  } else if (filteredHrValues.length >= 2) {
    return calcMean(filteredHrValues.slice(-2));
  } else {
    return filteredHrValues[filteredHrValues.length - 1];
  }
}

/**
 * Removes HR outliers (above mean + 3 std deviations)
 * @param {Array} hrArray
 * @returns {Array} cleaned hr values
 */
function removeOutliers(hrArray) {
  const sorted = quickSort(hrArray); // sort the array - small to large
  const quarterLength = Math.ceil(sorted.length / 4); // remove easy efforts
  const higherIntensity = sorted.slice(quarterLength); // keep upper 75% - that are higher intensity

  const mean = calcTrueMean(higherIntensity);
  const stdDev = getStandardDeviation(higherIntensity);
  const limit = mean + (3 * stdDev);

  return higherIntensity.filter((hr) => hr < limit);
}

/**
 * Calculates rounded mean
 * @param {Array} array
 * @returns {Number}
 */
function calcMean(array) {
  const n = array.length;
  const mean = array.reduce((a, b) => a + b, 0) / n;
  return Math.ceil(mean);
}

/**
 * Calculates exact mean (no rounding)
 * @param {Array} array
 * @returns {Number}
 */
function calcTrueMean(array) {
  const n = array.length;
  return array.reduce((a, b) => a + b, 0) / n;
}

/**
 * Calculates standard deviation
 * @param {Array} array
 * @returns {Number}
 */
function getStandardDeviation(array) {
  const n = array.length;
  const meanValue = calcTrueMean(array);
  const variance = array.map(x => Math.pow(x - meanValue, 2)).reduce((a, b) => a + b, 0) / n;
  return Math.sqrt(variance);
}
// https://www.myprocoach.net/calculators/hr-zones/#:~:text=Work%20out%20your%20heart%20rate%20zones&text=Zone%201%3A%20Easy%20%E2%80%93%2068%25,fat%20and%20carbohydrates%20as%20fuel.
// Zone	Intensity	Percentage of HRmax
// Zone 1	Very light	68–73%
// Zone 2	Light	    60–70%
// Zone 3	Moderate	70–80%
// Zone 4	Hard	   80–90%
// Zone 5	Maximum	   90–100%

/**
 * @function getHrZones
 * function that caluclates hr zones
 * @param {*} hr int
 * @returns zones {}
 */
function getHrZones(hr) {
 
  const zones = {};
  zones["zone1"] = [Math.ceil(hr * 0.68), Math.ceil(hr * 0.73)];
  zones["zone2"] = [Math.ceil(hr * 0.73), Math.ceil(hr * 0.8)];
  zones["zone3"] = [Math.ceil(hr * 0.8), Math.ceil(hr * 0.87)];
  zones["zone4"] = [Math.ceil(hr * 0.87), Math.ceil(hr * 0.93)];
  zones["zone5"] = [Math.ceil(hr * 0.93), hr];

  return zones;
}



module.exports = {calcMaxHr, getHrZones}