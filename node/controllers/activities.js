const axios = require("axios");
const _ = require("lodash");

// user activities model
const UserActivities = require("../models/UserActivities");
// helper functions
const { calcMaxHr, getHrZones } = require("../helpers/hrCalculation");
const { calcFtp } = require("../helpers/ftpCalculation");
const activityLoop = require("../helpers/addActivityData");
const calculateTss = require("../helpers/calculateTss");
const checkPbs = require("../helpers/checksPbs");

// key values for running and cycling used throughout the server
const { durations, distances } = require("../helpers/values");

/**
 * Get key info about individual
 * athlete from strava (ie name, etc)
 * Then this is used to get user id for stored data
 * on user in mongoDB. This returns all stored data,
 * this is called when the user first logs in
 */
exports.getAthlete = async (req, res) => {
  const errors = {};
  const token = req.headers.authorization;
  console.log(token, "called api");
  if (!token) {
    errors["error"] = "Permission not granted";
    return res.json(errors);
  }
  try {
    const response = await axios.get(`https://www.strava.com/api/v3/athlete`, {
      headers: { Authorization: token },
    });
    // https://www.strava.com/api/v3/athletes/{id}/stats

    const finalid = parseInt(response.data.id)
  
    const athleteStats = await axios.get(`https://www.strava.com/api/v3/athletes/${finalid}/stats`, {
      headers: { Authorization: token },
    });
  

    const foundUserActs = await UserActivities.findOne({
      athlete_id: response.data.id,
    });

    if (foundUserActs) {
  

      return res.send({ profile: response.data, user: foundUserActs, stats: athleteStats.data });
    }

    const id = parseInt(response.data.id);
    const newUser = new UserActivities({ athlete_id: id });
    const userToSave = await newUser.save();

    return res.json({ profile: response.data, user: userToSave, stats: athleteStats.data});
  } catch (err) {
    console.log(err);
  }
};


/**
 * 
 *  Bulk Imports all activities (200)
 *  loops through and adds running/cycling pbs
 *  maxhr, tss for each activiy
 * This will take up to an hour because 
 * of strava rate limit - so sleep function is called every 98 calls
 */

exports.importActivities = async (req, res) => {
  const errors = {};
  const token = await req.headers.Authorization;
  console.log(token, "THIS IS TOKEN FROM IMPORT ACTIVITIES")
  const userId = req.headers.id;
  console.log(userId, "THIS IS USERID FROM IMPORT")
  if (!token) {
    errors["error"] = "Permission not granted";
    return res.send(errors);
  }
  // First I am checking if there is data for activities in mongodb
  const foundUserActs = await UserActivities.findOne({ athlete_id: userId });
  if (foundUserActs) {
    if (foundUserActs.activities.length > 5) {
      return res.send((errors["error"] = "data has already imported"));
    }
  }

  let page_num = 1;
  const data_list = []; // used to store activities
  try { // get 200 activities through this loop
    while (page_num <= 3) {
    
      let response = await axios.get(
        `https://www.strava.com/api/v3/athlete/activities`,
        {
          headers: { Authorization: token },
          params: { per_page: 8, page: page_num },
        }
      );
      console.log("LOOP RUNNING TO FETCH DATA")
      console.log(response.data[0])
      data_list.push(...response.data); // push data to array
      page_num++;
    }
  } catch (err) {
    console.log(err.message);
  }
  // get all the extra data for each activity
  const data_set = await activityLoop(data_list, token);
 
  const allTime = {};
  const runAllTime = {};
  // seperate out runs and bike rides
  const bikeActivities = data_set.filter((element) =>
    element.hasOwnProperty("pbs")
  );

  const runActivities = data_set.filter((element) =>
    element.hasOwnProperty("runpbs")
  );
  // loop through each bike activity to find the max power for each duration
  for (duration of durations) {
    let result = bikeActivities.map((activity) => activity.pbs[duration]);
    allTime[duration] = _.max(result);
  }
  // loop through runs to find shortest time for each distance
  for (distance of distances) {
    let result = runActivities.map((activity) => activity.runpbs[distance]);
    runAllTime[distance] = _.min(result);
  }
  // calculate FTP
  const ftp = calcFtp(allTime);
  // calc maxHR for cycling
  const maxCyclingHr = calcMaxHr(bikeActivities, "ride");
    // calc maxHR for running
  const runMaxHr = calcMaxHr(runActivities, "run");
   // calc  hrzones
  const bikeZones = getHrZones(maxCyclingHr);
   // calc hrzones
  const runZones = getHrZones(runMaxHr);
  // calculate TSS for each activity
  for (element of data_set) {
    const finalTss = calculateTss(element, ftp, bikeZones, runZones);
    element["tss"] = finalTss;
  }

  /**  the data needs to be reversed - because otherwise the latest activity is first - 
  activities need to be arranged
   * first to last **/
  data_set.reverse();
  await UserActivities.findOneAndUpdate(
    { athlete_id: userId },
    {
      $push: { activities: { $each: data_set } },
      $set: {
        cyclingpbs: {
          15: allTime["15"],
          30: allTime["30"],
          60: allTime["60"],
          90: allTime["90"],
          120: allTime["120"],
          150: allTime["150"],
          180: allTime["180"],
          210: allTime["210"],
          240: allTime["240"],
          270: allTime["270"],
          300: allTime["300"],
          330: allTime["330"],
          360: allTime["360"],
          390: allTime["390"],
          410: allTime["410"],
          440: allTime["440"],
          480: allTime["480"],
          600: allTime["600"],
          720: allTime["720"],
          900: allTime["900"],
          1200: allTime["1200"],
          1800: allTime["1800"],
          2700: allTime["2700"],
          3600: allTime["3600"],
        },
        runningpbs: {
          400: runAllTime[400],
          800: runAllTime[800],
          1000: runAllTime[1000],
          2414: runAllTime[2414],
          3000: runAllTime[3000],
          5000: runAllTime[5000],
          10000: runAllTime[10000],
        },
        bikeHrZones: {
          zone1: bikeZones["zone1"],
          zone2: bikeZones["zone2"],
          zone3: bikeZones["zone3"],
          zone4: bikeZones["zone4"],
          zone5: bikeZones["zone5"],
        },
        runHrZones: {
          zone1: runZones["zone1"],
          zone2: runZones["zone2"],
          zone3: runZones["zone3"],
          zone4: runZones["zone4"],
          zone5: runZones["zone5"],
        },

        cyclingFTP: ftp,
        cyclingMaxHr: maxCyclingHr,
        runningMaxHr: runMaxHr,
      },
    },

  
  );

  // the user is not going to need the data
  // the client will have logged them out to wait to for the import function to run.
  // next time they log in the data will be retrieved from the athlete route
  return res.send(" Succesful import");
};

/**
 * Get the latest activities from Stava
 * this data is also filter to get pbs, cyclingpbs training stress
 *  and so on. I then run a checkPbs function to see if pbs have improved
 * This is called by the client when they login - so client updates
 * automatically
 **/
exports.getLatestActivities = async (req, res) => {
  // we need t
  const errors = {};
  const after = parseInt(req.params.after);
  console.log(after, "activities ran");
  const token = req.headers.authorization;
  console.log(token, "THIS IS THE TOKEN")
  if (!token) {
    errors["error"] = "Permission not granted";
    return res.status(400).send(errors);
  }
  try {
    let response = await axios.get(
      `https://www.strava.com/api/v3/athlete/activities`,
      {
        headers: { Authorization: token },
        params: { after: after },
        page: 3
      }
    );
    console.log(response.data)

    if (response.data.length == 0) {
      errors["error"] = "no activities found";
      return res.send(errors);
    }

    const data_list = [...response.data];
    console.log(data_list)

    const { id } = data_list[0].athlete;
    // equality check for latest actviity on mongo vs latest new activity
    const allActs = await UserActivities.findOne({ athlete_id: id });

    //the last activities to check its not the latest one.
    if (
      allActs.activities[allActs.activities.length - 1].id ==
      data_list[data_list.length - 1].id
    ) {
      errors["error"] = "this activity has already been added";
      console.log("activity already added")
      return res.status(400).send(errors);
    }
    // get all extra data for each activities i.e watts, distance 'streams'
    const data_set = await activityLoop(data_list, token);
   
    console.log(data_set, "THIS IS DATASET")
    /* checkPBs  = this is to check if there are new pbs - the helper function returns this destructured array */
    const [
      cyclingAllTime,
      runAllTime,
      updateFlagCycling,
      updateFlagRunning,
      ftpChange,
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

    //add tss score to each activity
    for (element of data_set) {
      const finalTss = calculateTss(
        element,
        allActs.cyclingFTP,
        allActs.bikeHrZones,
        allActs.runHrZones
      );
      element["tss"] = finalTss;
    }

    await UserActivities.updateOne(
      { athlete_id: id },
      { $push: { activities: { $each: data_set } } }
    );
   
    return res.send(data_set);
  } catch (err) {
    console.log(err);
  }
};
/**
 *
 *  Bulk Imports all activities (200)
 *  loops through and adds running/cycling pbs
 *  maxhr, tss for each activiy
 * This will take up to an hour because
 * of strava rate limit - so sleep function is called every 98 calls
 */

exports.importActivities = async (req, res) => {
  console.log("import activities ran")
  const errors = {};
  const token = await req.headers.authorization;
  console.log("THIS IS THE TOKEN")
  const userId = req.headers.id;
  if (!token) {
    errors["error"] = "Permission not granted";
    return res.send(errors);
  }
  // First I am checking if there is data for activities in mongodb
  const foundUserActs = await UserActivities.findOne({ athlete_id: userId });
  if (foundUserActs) {
    if (foundUserActs.activities.length > 5) {
      return res.send((errors["error"] = "data has already imported"));
    }
  }

  let page_num = 1;
  const data_list = []; // used to store activities
  try {
    // get 200 activities through this loop
    while (page_num <= 3) {
      let response = await axios.get(
        `https://www.strava.com/api/v3/athlete/activities`,
        {
          headers: { Authorization: token },
          params: { per_page: 8, page: page_num },
        }
      );

      data_list.push(...response.data); // push data to array
      page_num++;
    }
  } catch (err) {
    console.log(err.message);
  }
  // get all the extra data for each activity
  const data_set = await activityLoop(data_list, token);
  const allTime = {};
  const runAllTime = {};
  // seperate out runs and bike rides
  const bikeActivities = data_set.filter((element) =>
    element.hasOwnProperty("pbs")
  );

  const runActivities = data_set.filter((element) =>
    element.hasOwnProperty("runpbs")
  );
  // loop through each bike activity to find the max power for each duration
  for (duration of durations) {
    let result = bikeActivities.map((activity) => activity.pbs[duration]);
    allTime[duration] = _.max(result);
  }
  // loop through runs to find shortest time for each distance
  for (distance of distances) {
    let result = runActivities.map((activity) => activity.runpbs[distance]);
    runAllTime[distance] = _.min(result);
  }
  // calculate FTP
  const ftp = calcFtp(allTime);
  // calc maxHR for cycling
  const maxCyclingHr = calcMaxHr(bikeActivities, "ride");
  // calc maxHR for running
  const runMaxHr = calcMaxHr(runActivities, "run");
  // calc  hrzones
  const bikeZones = getHrZones(maxCyclingHr);
  // calc hrzones
  const runZones = getHrZones(runMaxHr);
  // calculate TSS for each activity
  for (element of data_set) {
    const finalTss = calculateTss(element, ftp, bikeZones, runZones);
    element["tss"] = finalTss;
  }

  /**  the data needs to be reversed - because otherwise the latest activity is first - 
  activities need to be arranged
   * first to last **/
  data_set.reverse();
  try {
    await UserActivities.findOneAndUpdate(
      { athlete_id: userId },
      {
        $push: { activities: { $each: data_set } },
        $set: {
          cyclingpbs: {
            15: allTime["15"],
            30: allTime["30"],
            60: allTime["60"],
            90: allTime["90"],
            120: allTime["120"],
            150: allTime["150"],
            180: allTime["180"],
            210: allTime["210"],
            240: allTime["240"],
            270: allTime["270"],
            300: allTime["300"],
            330: allTime["330"],
            360: allTime["360"],
            390: allTime["390"],
            410: allTime["410"],
            440: allTime["440"],
            480: allTime["480"],
            600: allTime["600"],
            720: allTime["720"],
            900: allTime["900"],
            1200: allTime["1200"],
            1800: allTime["1800"],
            2700: allTime["2700"],
            3600: allTime["3600"],
          },
          runningpbs: {
            400: runAllTime[400],
            800: runAllTime[800],
            1000: runAllTime[1000],
            2414: runAllTime[2414],
            3000: runAllTime[3000],
            5000: runAllTime[5000],
            10000: runAllTime[10000],
          },
          bikeHrZones: {
            zone1: bikeZones["zone1"],
            zone2: bikeZones["zone2"],
            zone3: bikeZones["zone3"],
            zone4: bikeZones["zone4"],
            zone5: bikeZones["zone5"],
          },
          runHrZones: {
            zone1: runZones["zone1"],
            zone2: runZones["zone2"],
            zone3: runZones["zone3"],
            zone4: runZones["zone4"],
            zone5: runZones["zone5"],
          },

          cyclingFTP: ftp,
          cyclingMaxHr: maxCyclingHr,
          runningMaxHr: runMaxHr,
        },
      }
    );
  } catch (err) {
    console.log(err);
  }

  // the user is not going to need the data
  // the client will have logged them out to wait to for the import function to run.
  // next time they log in the data will be retrieved from the athlete route
  return res.send(" Succesful import");
};
