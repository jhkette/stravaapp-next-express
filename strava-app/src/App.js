import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import _ from "lodash";
import { Routes, Route } from "react-router-dom";
// context
import { useAuth } from "./context/AuthContext";
// components
import Sidebar from "./components/Sidebar";
import Landing from "./Landing";
import Cycling from "./Cycling";
import IndoorCycling from "./IndoorCycling";
import Running from "./Running";
import ProtectedRoute from "./protectRoute";
import Footer from "./components/Footer";
// config
import { API_BASE_URL } from "./config";
import Header from "./components/Header";

function App() {
  // initial link
  const [link, setLink] = useState("");
  // athlete data save as state
  const [athlete, setAthlete] = useState({});
  const [latest, setLatest] = useState(null);
  const [userActivities, setUseractivities] = useState([]);
  const [userRecords, setUserRecords] = useState({});
  const [datasets, setDatasets] = useState({});
  // fetched boolean flags
  const [fetched, setFetched] = useState(false);
  const [latestFetched, setLatestFetched] = useState(false);

  const [message, setMessage] = useState("");

  // this gives access to global auth state
  const { auth, setAuth } = useAuth();
  /**
   * Function fetches both the userData set and the dataset data.
   * @function fetchAthleteData
   * @return void
   */
  const fetchAthleteData = async (config) => {
    const userData = await axios.get(API_BASE_URL + "/user/athlete", config);
    const dataSet = await axios.get(API_BASE_URL + "/data/datasets", config);
    // set boolean flag as fetched
    if (userData.data.user.activities && dataSet.data.marathon) {
      setFetched(true);
    }
    return { userData, dataSet };
  };
  /**
   * Function fetches both the latest activities - from last login.
   * @function getLatestData
   * @return void
   */
  const getLatestData = useCallback(async () => {
    const token = Cookies.get("token");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    try {
      const date = Math.floor(Date.parse(latest) / 1000);
      const activities = await axios.get(
        API_BASE_URL + `/user/activities/${date}`,
        config
      );
      if (activities.data.error) {
        console.log(activities.data.error);
        return;
      }
      if (activities.data.length) {
        setLatestFetched(true);
        setUseractivities((oldArray) => [...oldArray, ...activities.data]);
      }
    } catch (error) {
      console.log(error);
    }
  }, [latest, setLatestFetched, setUseractivities]);

  /**
   * @function importData
   * @returns void
   * function runs when user logs in for first time
   * and first set of data is imported.
   * sets UserRecords and sets Useractivities
   */
  const importData = async () => {
    const token = Cookies.get("token");
    setMessage("Please come back and login after 15 minutes");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    axios(API_BASE_URL + `/user/activities/activities-list`, config);
    setTimeout(() => {
      logout();
    }, 20000);
  };

  /**
   * @function logout
   * @return void
   * remove token
   * calls logout function on server
   */
  const logout = () => {
    setAuth(false);
    setMessage("");
    Cookies.remove("token");
    axios.get(API_BASE_URL + "/auth/logout");
    window.location.href = "/";
    if (window.location.pathname === "/") {
      window.location.reload();
    }
  };

  /*
   * Useffect function runs when page loads,
   * return the oauth link to authorise the user
   */
  useEffect(() => {
    if (!link.length) {
      axios
        .get(API_BASE_URL + "/auth/link")
        .then((res) => setLink(res.data.link))
        .catch((err) => {
          console.log(err);
        });
    }
  }, [link]);

  // this useffect function - gets the main athlete data from /user/athlete/
  // and the datasets from /data/datasets. Then sets the state variables with response.
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      setAuth(true);
    }
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    if (token && !fetched) {
      fetchAthleteData(config)
        .then(({ userData, dataSet }) => {
          if (userData.data.error) {
            console.log(userData.data.error);
            return;
          }
          if (dataSet.data.error) {
            console.log(dataSet.data.error);
            return;
          }

          // set the state values with response
          setAthlete(userData.data.profile);
          const userRecordsInfo = _.omit(userData.data.user, "activities");
          setUserRecords(userRecordsInfo);

          setUseractivities(userData.data.user.activities);
          setLatest(
            userData.data.user.activities[
              userData.data.user.activities.length - 1
            ]["start_date"]
          );
          setDatasets({
            marathon: dataSet.data.marathon,
            half: dataSet.data.half,
            alpe: dataSet.data.alpe,
            box: dataSet.data.box,
            hardknott: dataSet.data.hardknott,
            scotland: dataSet.data.scotland,
          });
        })
        .catch(console.error);
    }
  }, [setAuth, fetched]);
  /**
   * this useffect gets the latest activities from strava api.
   * it calls the api with the date of last activity in app state.
   * and retrieves all events recorded after that.
   */
  useEffect(() => {
    const token = Cookies.get("token");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    if (auth && userActivities.length && !latestFetched) {
      getLatestData(config);
    }
  }, [auth, latest, userActivities, getLatestData, latestFetched]);

  // define weight variable for cycling page
  let weight;
  if (athlete.weight === undefined) {
    weight = 75;
  } else {
    weight = athlete.weight;
  }

  return (
    <div className="font-body flex">
      <Sidebar
        logout={logout}
        importData={importData}
        userActivities={userActivities}
      />
      <div className="h-auto w-full ">
        <Header athlete={athlete} message={message} />
        <div className="bg-grey-50">
          {/* App Naviation each route shows a different element in the 
          main block of the page/ ie the cycling page, running page etc*/}
          <Routes>
            <Route
              exact
              path="/"
              element={
                <Landing
                  auth={auth}
                  logout={logout}
                  userActivities={userActivities}
                  importData={importData}
                  link={link}
                  message={message}
                  fetched={fetched}
                />
              }
            ></Route>

            <Route exact path="/cycling" element={<ProtectedRoute />}>
              <Route
                path="/cycling"
                element={
                  <Cycling
                    userRecords={userRecords}
                    ftp={userRecords.cyclingFTP}
                    scotland={datasets.scotland}
                    weight={weight}
                    hardknott={datasets.hardknott}
                  />
                }
              ></Route>
            </Route>
            <Route exact path="/indoorcycling" element={<ProtectedRoute />}>
              <Route
                path="/indoorcycling"
                element={
                  <IndoorCycling
                    userRecords={userRecords}
                    ftp={userRecords.cyclingFTP}
                    alpe={datasets.alpe}
                    weight={weight}
                    box={datasets.box}
                  />
                }
              ></Route>
            </Route>
            <Route exact path="/running" element={<ProtectedRoute />}>
              <Route
                exact
                path="/running"
                element={
                  <Running
                    userRecords={userRecords}
                    mardataset={datasets.marathon}
                    halfdataset={datasets.half}
                  />
                }
              ></Route>
            </Route>
          </Routes>
          <Footer id={athlete.id} />
        </div>
      </div>
    </div>
  );
}

export default App;
