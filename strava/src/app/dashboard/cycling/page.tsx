"use client";
import { useGetUserQuery, useGetLatestQuery } from "@/lib/activitySlice";
import LineChart from "@/app/graphs/cyclingPower";

export default function Page() {
  const { data: result1, isError, isLoading, isSuccess } = useGetUserQuery();
  console.log(result1);
  return (
    <div>
      page
      {isSuccess && (
        <LineChart
          power={{
            cyclingpbs: result1?.user.cyclingpbs,
            cyclingFTP: result1?.user.cyclingFTP,
          }}
        />
      )}
    </div>
  );
}
