"use client";
import { useSelector } from "react-redux";
import type { RootState } from "../../lib/store";
import { useGetUserQuery } from "@/lib/activitySlice";
import { intervalToDuration } from "date-fns";
import { useEffect, useState } from "react";
import EventsCalender from "@/graphs/calender";
import IsAuth from "../../lib/IsAuth";
import axios from "axios"
import Cookies from "js-cookie";
function Page() {
  const [latest, setLatest] = useState("")
  const baseURL = "http://localhost:3000/api"
  const auth = useSelector((state: RootState) => state.authorisation.auth);

  const { data: result1, isError, isLoading, isSuccess, refetch } = useGetUserQuery();
   console.log(result1)
  
  useEffect(()=> {
    const getTest = async () => {
    const data = await axios.get("/api/test")
    console.log(data)
    }
    getTest()
  })

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
        console.log(date, config)
        if(activities.data.user.activities.length){
          refetch()
        }
        // if an error object from api call return
       console.log(activities)
      } catch (error) {
        console.log(error);
      }
    };
    if (auth && isSuccess) {
      setLatest(result1?.user.activities[result1?.user.activities.length -1]["start_date"])
      getLatestData();
    }
  }, [auth, isSuccess, result1?.user.activities, latest, refetch, baseURL]);


  const getKm = () => {
    if (result1) {
      return (
        result1?.user?.activities.slice(-5).reduce((acc, activities) => {
          return acc + activities.distance;
        }, 0) / 1000
      );
    }
  };

  const getCalories = () => {
    if (result1) {
      return result1?.user?.activities.slice(-5).reduce((acc, activities) => {
        const kj = activities.kilojoules ? activities.kilojoules : 0
        return acc + kj;
      }, 0)}
  
    }

  const getTime = () => {
    if (result1) {
      const seconds = result1?.user?.activities
        .slice(-5)
        .reduce((acc, activities) => {
          return acc + activities.elapsed_time;
        }, 0);
      const time = intervalToDuration({ start: 0, end: seconds * 1000 });
      return time;
    }
  };
  const formatDuration = (duration: any) => {
    if (result1) {
      const hours = String(duration.hours).padStart(2, "0");
      const minutes = String(duration.minutes).padStart(2, "0");
      const seconds = String(duration.seconds).padStart(2, "0");
      return `${hours}:${minutes}:${seconds}`;
    }
  };

  const formattedTime = formatDuration(getTime());

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
