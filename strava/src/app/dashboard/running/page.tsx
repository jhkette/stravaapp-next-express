"use client";
import { useGetUserQuery, useGetLatestQuery } from "@/lib/activitySlice";
import LineChart from "@/app/graphs/runningPace";
import RunningFive from "@/app/graphs/runningPaceFive";

export default function Page() {
  const { data: result1, isError, isLoading, isSuccess } = useGetUserQuery();

  return (
    <div>
   
      {result1?.user.runningpbs["10000"] && (
        <LineChart runningpbs={result1?.user.runningpbs} />
      )}
      {(result1?.user.runningpbs && !result1?.user.runningpbs["10000"]) && (
        <RunningFive runningpbs={result1?.user.runningpbs} />
      )}
    </div>
  );
}
