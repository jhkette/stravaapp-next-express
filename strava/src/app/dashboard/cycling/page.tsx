"use client";
import { useGetUserQuery, useGetDatasetsQuery } from "@/lib/activitySlice";
import LineChart from "@/graphs/cyclingPower";
import RidechartRegression from "@/graphs/rideRegression";
import IsAuth from "@/lib/IsAuth";
import HeartRate from "@/graphs/heartRate";
import FtpChart from "@/graphs/ftp";
import Image from "next/image";
import { FaSpinner } from "react-icons/fa";
import {FaceFrownIcon} from '@heroicons/react/24/solid'
import PowerPbs from "@/graphs/PowerPbs";
function Page() {
  const { data: result1, isError, isLoading, isSuccess } = useGetUserQuery();
  const {
    data: result2,
    isError: isError2,
    isLoading: loading,
    isSuccess: dataSuccess,
  } = useGetDatasetsQuery();

  if (isLoading) {
    return <FaSpinner />;
  }

  if(!result1?.user.cyclingpbs["1200"]){
    return  (
    <div className="w-fit py-4 mx-auto mb-96">
    <FaceFrownIcon className="size-32 text-blue-500"/>

   <p className="text-xl text-center">Please add cycling data </p>
   </div>
    )

 }

  return (
    <div>
      {isSuccess && !result1?.user.cyclingpbs["1200"] && (
        <p>Please upload cycling data </p>
      )}
      {isSuccess && (
        <div className="w-full max-w-1200px mx-auto flex justify-between mx-auto px-24 my-12">
          <div className="w-9/12">  
          <LineChart
            power={{
              cyclingpbs: result1?.user.cyclingpbs,
              cyclingFTP: result1?.user.cyclingFTP,
            }}
          />
          </div>
          <div className="w-fit bg-white p-4 rounded-xl"> 
           <PowerPbs/>
           </div>
        </div>
       
      )}
      {isSuccess && dataSuccess && (
        <>
          <div className="w-full flex flex-row justify-start flex-wrap px-24">
            <div className="w-8/12  my-12">
              <RidechartRegression
                cyclingpbs={result1?.user.cyclingpbs}
                ftp={result1?.user.cyclingFTP}
                weight={result1?.profile.weight}
                regdata={result2?.hardknott}
              />
              </div>
              <div className="flex flex-col py-8 w-3/12 my-4">
                <Image
                  src={"/images/hardknott.jpeg"}
                  width={341}
                  height={227}
                  alt="Picture of the author"
                  style={{
                    height: "227px",
                    width: "341px",
                  }}
                  className="hover:shadow-2xl shadow-inner block"
                />
                <p className="py-8 text-lg">
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Deleniti neque necessitatibus fugit possimus error qui dolorum
                  mollitia, earum tempore iste odio fuga sunt iure porro. Nulla
                  quibusdam nostrum sit aliquam.
                </p>
              </div>
            
          </div>
          <div className="w-full flex flex-row justify-end px-12">
          <div className="flex flex-col my-12 w-3/12 mr-8">
              <Image
                src={"/images/balach.jpg"}
                width={460}
                height={306}
                alt="Picture of the author"
                className="hover:shadow-2xl shadow-inner mb-8"
              />
              <p className="text-lg">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ab
                quisquam unde, repellendus atque quibusdam expedita sint
                repudiandae quia dolore distinctio. Placeat dicta ipsam at
                similique sapiente itaque quam repellendus laudantium!
              </p>
            </div>
            <div className="w-8/12  my-12">
              <RidechartRegression
                regdata={result2?.scotland}
                cyclingpbs={result1?.user.cyclingpbs}
                weight={result1?.profile.weight}
                ftp={result1?.user.cyclingFTP}
              />
            </div>
          
          </div>
          <div className="flex flex-row flex-wrap justify-around">
            <div className="w-4/12  my-12">
              <HeartRate hr={result1?.user.bikeHrZones} />
              <p className="py-8 text-lg">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                Deleniti neque necessitatibus fugit possimus error qui dolorum
                mollitia, earum tempore iste odio fuga sunt iure porro. Nulla
                quibusdam nostrum sit aliquam.
              </p>
            </div>
            <div className="w-4/12 my-12">
              <FtpChart ftp={result1?.user.cyclingFTP} />
              <p className="py-8 text-lg">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                Deleniti neque necessitatibus fugit possimus error qui dolorum
                mollitia, earum tempore iste odio fuga sunt iure porro. Nulla
                quibusdam nostrum sit aliquam.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default IsAuth(Page);
