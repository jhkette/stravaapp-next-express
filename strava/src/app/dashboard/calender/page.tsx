"use client";
import {
  useGetUserQuery,
} from "@/lib/activitySlice";
import EventsCalender from "../../graphs/calender"

import IsAuth from "./../../IsAuth";

function Page() {
  const { data: result1, isError, isLoading, isSuccess } = useGetUserQuery();
  // const {
  //   data: result2,
  //   isError: isError2,
  //   isLoading: loading,
  //   isSuccess: datasetSuccess,
  // } = useGetDatasetsQuery();

  return (
    <div className="px-24">
      {result1?.user.activities && (
        <EventsCalender userActivities={result1?.user.activities} />
      )}
      
    </div>
  );
}

export default IsAuth(Page)