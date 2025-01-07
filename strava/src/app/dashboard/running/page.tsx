"use client";
import {
  useGetUserQuery,
  useGetDatasetsQuery,
} from "@/lib/activitySlice";
import LineChart from "@/app/graphs/runningPace";
import RunningFive from "@/app/graphs/runningPaceFive";
import RunchartRegression from "@/app/graphs/runRegression";
import HeartRate from "@/app/graphs/heartRate";
import IsAuth from "./../../IsAuth";

function Page() {
  const { data: result1, isError, isLoading, isSuccess } = useGetUserQuery();
  const {
    data: result2,
    isError: isError2,
    isLoading: loading,
    isSuccess: datasetSuccess,
  } = useGetDatasetsQuery();

  return (
    <div>
      {result1?.user.runningpbs["10000"] && (
         <div className="w-auto mx-auto px-12">
        <LineChart runningpbs={result1?.user.runningpbs} />
        </div>
      )}
      {result1?.user.runningpbs["5000"] && !result1?.user.runningpbs["10000"] && (
        <div className="w-auto mx-auto px-12">
        <RunningFive runningpbs={result1?.user.runningpbs} />
        </div>
      )}
      {(result1?.user.runningpbs["5000"] && datasetSuccess) && (
        <>
          <div className="flex flex-row items-start py-4">
         <div className="w-7/12 mx-12 ">
            <RunchartRegression
              runningpbs={result1?.user.runningpbs}
              event={"Half Marathon"}
              regdata={result2?.half[0].dataset}
            />
          </div>
          <p className="w-5/12">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos aspernatur autem deserunt veniam quidem deleniti, laudantium impedit inventore sed quia ipsa sint, 
            facere voluptatem quisquam, exercitationem temporibus illo assumenda architecto.</p>
          </div>
          <div className="flex flex-row items-start py-4">
          <div className="w-7/12 mx-12 ">
            <RunchartRegression
              runningpbs={result1?.user.runningpbs}
              event={"Marathon"}
              regdata={result2?.marathon[0].dataset}
            />
          </div>
          <p className="w-5/12">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos aspernatur autem deserunt veniam quidem deleniti, laudantium impedit inventore sed quia ipsa sint, 
            facere voluptatem quisquam, exercitationem temporibus illo assumenda architecto.</p>
          </div>
          <div className="flex flex-row items-start">
          <div className="w-6/12 mx-12">
            <HeartRate 
             hr={result1?.user.runHrZones}
            />
          </div>
          <p className="w-5/12">Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti laudantium quos porro 
            exercitationem unde, nesciunt corrupti, rerum eaque velit nihil praesentium? 
            Molestias quas tempora pariatur voluptas dignissimos saepe ipsam ea?</p>
          </div>
        
        </>
      )}
      { !result1?.user.runningpbs["5000"] && (
         <div className="w-8/12 py-4 mx-auto mt-48">
        <p>Please add running data </p>
        </div>

      )}
    </div>
  );
}

export default IsAuth(Page)