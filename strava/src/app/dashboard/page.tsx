"use client";

import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../lib/store";
import { useGetUserQuery, useGetLatestQuery } from "@/lib/activitySlice";
import { intervalToDuration } from "date-fns";
import Header from "../ui/header";

export default function Page() {
  const auth = useSelector((state: RootState) => state.authorisation.auth);

  const { data: result1, isError, isLoading, isSuccess } = useGetUserQuery();

  const {
    data: res2,
    isError: error2,
    isLoading: load2,
    isSuccess: succcess2,
  } = useGetLatestQuery(
    Date.parse(
      result1!?.user.activities[result1!?.user.activities.length - 1][
        "start_date_local"
      ]
    ) / 1000,
    { skip: !result1?.user }
  );

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
        return acc + activities.kilojoules;
      }, 0);
    }
  };
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
    <div className="flex flex-col  w-full px-24">
      <Header />
      {isSuccess &&
      <>
      <h2 className="text-xl">Last 5 activities</h2>
      
      <div className="flex flex-row gap-5">
        <p className="bg-green-200 p-4 rounded-md w-48">Km travelled {getKm()}</p>
        <p className="bg-orange-200 p-4 rounded-md w-48">Calories burnt {getCalories()}</p>
        <p className="bg-blue-200 p-4 rounded-md w-48"> Time spent{formattedTime}</p>
      </div>
      </> }
    </div>
  );
}
