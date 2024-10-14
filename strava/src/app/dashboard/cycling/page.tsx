"use client";
import { useGetUserQuery, useGetDatasetsQuery } from "@/lib/activitySlice";
import LineChart from "@/app/graphs/cyclingPower";
import RidechartRegression from "@/app/graphs/rideRegression";

export default function Page() {
  const { data: result1, isError, isLoading, isSuccess } = useGetUserQuery();
  const {
    data: result2,
    isError: isError2,
    isLoading: loading,
    isSuccess: dataSuccess,
  } = useGetDatasetsQuery();

  return (
    <div>
      {result1?.user.cyclingpbs["1200"] && <p>Please upload upload </p>}
      {isSuccess && (
        <LineChart
          power={{
            cyclingpbs: result1?.user.cyclingpbs,
            cyclingFTP: result1?.user.cyclingFTP,
          }}
        />
      )}
      {isSuccess && dataSuccess && (
        <>
          <div className="w-8/12 py-4">
            <RidechartRegression
              cyclingpbs={result1?.user.cyclingpbs}
              ftp={result1?.user.cyclingFTP}
              weight={result1?.profile.weight}
              regdata={result2?.hardknott}
            />
          </div>
          <div className="w-8/12 py-4">
            <RidechartRegression
              regdata={result2?.scotland}
              cyclingpbs={result1?.user.cyclingpbs}
              weight={result1?.profile.weight}
              ftp={result1?.user.cyclingFTP}
            />
          </div>
        </>
      )}
    </div>
  );
}
