"use client";

import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../lib/store";
import {

  useGetUserQuery,
  useGetLatestQuery,
} from "@/lib/activitySlice";
import { intervalToDuration } from "date-fns";
import { useRouter } from "next/navigation";
import Header from "../ui/header"

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

  console.log(res2);

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
     <Header/>

      <p> {getKm()}</p>
      <p> {getCalories()}</p>
      <p> {getCalories()}</p>
      <p>{formattedTime}</p>
    </div>
  );
}
