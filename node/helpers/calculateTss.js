const { durations, distances } = require("./values");

/**
 * Calculates TSS (Training Stress Score) from an activity.
 * @param {Object} activity - Activity data.
 * @param {number} ftp - Functional Threshold Power.
 * @param {Object} bikeHrZones - HR zones for cycling.
 * @param {Object} runZones - HR zones for running.
 * @returns {number} - Calculated TSS (rounded).
 */
function calculateTss(activity, ftp, bikeHrZones, runZones) {
  if (!activity.has_heartrate && !activity.device_watts) {
    return 0;
  }

  if (activity.device_watts) {
    const intensityFactor = activity.weighted_average_watts / ftp;
    const tss =
      ((activity.moving_time *
        activity.weighted_average_watts *
        intensityFactor) /
        (ftp * 3600)) *
      100;
    return Math.round(tss);
  }

  // Heart rate method
  const zones = (activity.type === "Ride" || activity.type === "VirtualRide")
    ? bikeHrZones
    : runZones;

  const tssScore = {
    1: 30,
    2: 55,
    3: 70,
    4: 80,
    5: 120,
    6: 150, // Optional: you might want a "zone 6+" if HR is super high
  };

  const hours = activity.moving_time / 3600;
  const hr = activity.average_heartrate || 0;
  let tss = 0;

  if (hr <= zones.zone1[1]) {
    tss = hours * tssScore[1];
  } else if (hr <= zones.zone2[1]) {
    tss = hours * tssScore[2];
  } else if (hr <= zones.zone3[1]) {
    tss = hours * tssScore[3];
  } else if (hr <= zones.zone4[1]) {
    tss = hours * tssScore[4];
  } else if (hr <= zones.zone5[1]) {
    tss = hours * tssScore[5];
  } else {
    // HR is above zone 5
    tss = hours * (tssScore[6] || tssScore[5]); // fallback if zone 6 doesn't exist
  }

  return Math.round(tss);
}

module.exports = calculateTss;