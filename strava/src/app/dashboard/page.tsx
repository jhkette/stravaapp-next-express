"use client";
import { useSelector } from "react-redux";
import type { RootState } from "../../lib/store";
import { useGetUserQuery } from "@/lib/activitySlice";
import { intervalToDuration } from "date-fns";
import { useEffect, useState } from "react";
import EventsCalender from "@/components/calender";
import IsAuth from "../../lib/IsAuth";
import axios from "axios";
import { setimporttrue, setimportfalse } from "@/lib/importSlice";

import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
function Page() {
  const [latest, setLatest] = useState("");
  const baseURL = "http://localhost:3000/api";
  const auth = useSelector((state: RootState) => state.authorisation.auth);

  const {
    data: result1,
    isError,
    isLoading,
    isSuccess,
    refetch,
  } = useGetUserQuery();
  console.log(result1, "THIS IS RESULT 1");

  useEffect(() => {
    const getTest = async () => {
      const data = await axios.get("/api/rundata");
      console.log(data);
    };
    getTest();
  });

  useEffect(() => {
    const token = Cookies.get("token");
    const config = {
      headers: { Authorization: `Bearer ${token}`, id: result1?.profile.id },
    };
    const importData = async () => {
      const activities = await axios.get(
        baseURL + `/user/activities/activities-list`,
        config
      );
      console.log(activities)
      refetch();
    };

    if (isSuccess && result1?.user.activities.length === 0) {
      importData();
    }
  }, [isSuccess, result1?.user.activities.length, refetch, result1?.profile.id]);

  useEffect(() => {
    const token = Cookies.get("token");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const getLatestData = async () => {
      try {
        // date is a unix timestamp - just modifying so it works with strava api
        const date = Math.floor(Date.parse(latest) / 1000);
        const activities = await axios.get(
          baseURL + `/user/activities/${date}`,
          config
        );

        const athlete = await axios.get(
          `http://localhost:8080/api/importactivity`,
          config
        );
        console.log(athlete, "console logging everything");
        if (activities.data.user.activities.length) {
          refetch();
        }
        // if an error object from api call return
        console.log(activities);
      } catch (error) {
        console.log(error);
      }
    };

    if (auth && result1?.user.activities.length) {
      setLatest(
        result1?.user.activities[result1?.user.activities.length - 1][
          "start_date"
        ]
      );
      console.log(
        result1?.user.activities[result1?.user.activities.length - 1][
          "start_date"
        ]
      );

      getLatestData();
    }
  }, [auth, isSuccess, result1?.user.activities, latest, refetch, baseURL]);

 

  return (
    <div className="flex flex-col  w-full px-24 ">
      <div className="px-24">
        {result1?.user.activities && (
          <EventsCalender userActivities={result1?.user.activities} />
        )}
      </div>
    </div>
  );
}

export default IsAuth(Page);
