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
    isSuccess: success2,
  } = useGetDatasetsQuery();
  console.log(result1);

  console.log(result2?.hardknott);

  return (
    <div>
      {isSuccess && (
        <LineChart
          power={{
            cyclingpbs: result1?.user.cyclingpbs,
            cyclingFTP: result1?.user.cyclingFTP,
          }}
        />
      )}
      {isSuccess && success2 && (
        <>
          <div className="w-8/12 py-4">
            <RidechartRegression
              cyclingpbs={result1?.user.cyclingpbs}
              ftp={result1?.user.cyclingFTP}
              event={"Hardknott pass"}
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
