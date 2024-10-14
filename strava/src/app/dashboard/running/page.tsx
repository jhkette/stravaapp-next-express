"use client";
import {
  useGetUserQuery,
  useGetLatestQuery,
  useGetDatasetsQuery,
} from "@/lib/activitySlice";
import LineChart from "@/app/graphs/runningPace";
import RunningFive from "@/app/graphs/runningPaceFive";
import RunchartRegression from "@/app/graphs/runRegression";

export default function Page() {
  const { data: result1, isError, isLoading, isSuccess } = useGetUserQuery();
  const {
    data: result2,
    isError: isError2,
    isLoading: loading,
    isSuccess: success2,
  } = useGetDatasetsQuery();

  return (
    <div>
      {result1?.user.runningpbs["10000"] && (
        <LineChart runningpbs={result1?.user.runningpbs} />
      )}
      {result1?.user.runningpbs && result1?.user.runningpbs["5000"] && !result1?.user.runningpbs["10000"] && (
        <RunningFive runningpbs={result1?.user.runningpbs} />
      )}
      {result1?.user.runningpbs["5000"] && result2 && (
        <>
          <div className="w-8/12 py-4">
            <RunchartRegression
              runningpbs={result1?.user.runningpbs}
              event={"Half Marathon"}
              regdata={result2?.half[0].dataset}
            />
          </div>

          <div className="w-8/12 py-4">
            <RunchartRegression
              runningpbs={result1?.user.runningpbs}
              event={"Marathon"}
              regdata={result2?.marathon[0].dataset}
            />
          </div>
        
        </>
      )}
      { !result1?.user.runningpbs["5000"] && (
         <div className="w-8/12 py-4 mx-auto mt-48">
        <p>Please load running data... </p>
        </div>

      )}
    </div>
  );
}
