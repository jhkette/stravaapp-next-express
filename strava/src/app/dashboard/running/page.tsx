"use client";
import { useGetUserQuery, useGetDatasetsQuery } from "@/lib/activitySlice";
import LineChart from "@/components/runningPace";
import RunningFive from "@/components/runningPaceFive";
import RunchartRegression from "@/components/runRegression";
import HeartRate from "@/components/heartRate";
import IsAuth from "@/lib/IsAuth";
import { FaSpinner } from "react-icons/fa";
import { FaceFrownIcon } from "@heroicons/react/24/solid";
import RunningPbs from "@/components/RunningPbs";
import { format, secondsToMilliseconds } from 'date-fns';

function Page() {
  const { data: result1, isError, isLoading, isSuccess } = useGetUserQuery();
  const {
    data: result2,
    isError: isError2,
    isLoading: loading,
    isSuccess: datasetSuccess,
  } = useGetDatasetsQuery();

  if (isLoading) {
    return <FaSpinner />;
  }

  const convertSecondsToTime = (seconds: number) => {
    // Convert seconds to milliseconds since date-fns works with milliseconds
    const timeInMilliseconds = secondsToMilliseconds(seconds);
  
    // Format the time as hh:mm:ss
    return format(timeInMilliseconds, 'HH:mm:ss');
  };

  if (!result1?.user.runningpbs["5000"]) {
    return (
      <div className="w-fit py-4 mx-auto mb-96">
        <FaceFrownIcon className="size-32 text-blue-500" />

        <p className="text-xl text-center">Please add running data </p>
      </div>
    );
  }

  return (
    <div>
      {result1?.user.runningpbs["10000"] && 
         <div className="w-full max-w-1200px mx-auto flex justify-between mx-auto px-24 my-12">
          <div className="w-9/12">  
          <LineChart runningpbs={result1?.user.runningpbs} />
        </div>
         <div className="w-fit bg-white p-4 rounded-xl"> 
                   <RunningPbs/>
            </div>
            </div>
      }
      {result1?.user.runningpbs["5000"] &&
        !result1?.user.runningpbs["10000"] && (
        

<div className="w-full max-w-1200px mx-auto flex justify-between mx-auto px-24 my-12">
<div className="w-9/12">  
<RunningFive runningpbs={result1?.user.runningpbs} />
</div>
<div className="w-fit bg-white p-4 rounded-xl"> 
         <RunningPbs/>
  </div>
  </div>
        )}
      {result1?.user.runningpbs["5000"] && datasetSuccess && (
        <>
          <div className="flex flex-row items-start mx-auto  py-4 px-12">
            <div className="w-6/12 mx-12 ">
              <RunchartRegression
                runningpbs={result1?.user.runningpbs}
                event={"Half Marathon"}
                regdata={result2?.half[0].dataset}
              />
            </div>
            <p className="w-5/12 text-lg">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos
              aspernatur autem deserunt veniam quidem deleniti, laudantium
              impedit inventore sed quia ipsa sint, facere voluptatem quisquam,
              exercitationem temporibus illo assumenda architecto.
            </p>
          </div>
          <div className="flex flex-row items-start mx-auto  py-4 px-12">
          <p className="w-5/12 mx-12 text-lg">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos
              aspernatur autem deserunt veniam quidem deleniti, laudantium
              impedit inventore sed quia ipsa sint, facere voluptatem quisquam,
              exercitationem temporibus illo assumenda architecto.
            </p>
            <div className="w-6/12 mx-12 ">
              <RunchartRegression
                runningpbs={result1?.user.runningpbs}
                event={"Marathon"}
                regdata={result2?.marathon[0].dataset}
              />
            </div>
           
          </div>
          <div className="flex flex-row justify-between items-start px-24 my-8">
            <div className="w-5/12">
              <HeartRate hr={result1?.user.runHrZones} />
            </div>
            <p className="w-6/12 text-lg">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti
              laudantium quos porro exercitationem unde, nesciunt corrupti,
              rerum eaque velit nihil praesentium? Molestias quas tempora
              pariatur voluptas dignissimos saepe ipsam ea?
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default IsAuth(Page);
