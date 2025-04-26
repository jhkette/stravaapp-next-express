const { durations, distances } = require("./values");

/**
 * @function checkPbs
 * Check to see if personal bests (PBs) have improved.
 * @param {Array} dataSet - Array of activity objects.
 * @param {Object} cyclingAllTime - Existing cycling PBs.
 * @param {Object} runAllTime - Existing running PBs.
 * @returns {Array} - Updated [cyclingAllTime, runAllTime, updateFlagCycling, updateFlagRunning, ftpChange].
 */
function checkPbs(dataSet, cyclingAllTime, runAllTime) {
  let updateFlagCycling = false;
  let updateFlagRunning = false;
  let ftpChange = false;

  for (const activity of dataSet) {
    const { type, pbs, runpbs } = activity;

    if ((type === "Ride" || type === "VirtualRide") && pbs) {
      for (const duration of durations) {
        const newPower = pbs[duration];
        const currentBest = cyclingAllTime[duration];

        if (newPower != null && (currentBest == null || newPower > currentBest)) {
          if (duration === "720" || duration === "1200") {
            ftpChange = true;
          }
          updateFlagCycling = true;
          cyclingAllTime[duration] = newPower;
        }
      }
    }

    if (type === "Run" && runpbs) {
      for (const distance of distances) {
        const newTime = runpbs[distance];
        const currentBest = runAllTime[distance];

        if (newTime != null && (currentBest == null || newTime < currentBest)) {
          updateFlagRunning = true;
          runAllTime[distance] = newTime;
        }
      }
    }
  }

  return [cyclingAllTime, runAllTime, updateFlagCycling, updateFlagRunning, ftpChange];
}

module.exports = checkPbs;