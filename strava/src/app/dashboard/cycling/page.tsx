"use client";
import { useGetUserQuery, useGetDatasetsQuery } from "@/lib/activitySlice";
import LineChart from "@/app/graphs/cyclingPower";
import RidechartRegression from "@/app/graphs/rideRegression";
import IsAuth from "./../../IsAuth";
import HeartRate from "@/app/graphs/heartRate";
import FtpChart from "@/app/graphs/ftp";
import Image from "next/image"

function Page() {
  const { data: result1, isError, isLoading, isSuccess } = useGetUserQuery();
  const {
    data: result2,
    isError: isError2,
    isLoading: loading,
    isSuccess: dataSuccess,
  } = useGetDatasetsQuery();

  return (
    <div>
      {isSuccess && !result1?.user.cyclingpbs["1200"] && <p>Please upload cycling data </p>}
      {isSuccess && (
        <div className="w-auto mx-auto px-12 my-12">
        <LineChart
          power={{
            cyclingpbs: result1?.user.cyclingpbs,
            cyclingFTP: result1?.user.cyclingFTP,
          }}
          
        />
        </div>
      )}
      {isSuccess && dataSuccess && (
        <>
         <div className="w-full flex flex-col flex-wrap px-12">
          <div className="w-10/12  my-12">
            <RidechartRegression
              cyclingpbs={result1?.user.cyclingpbs}
              ftp={result1?.user.cyclingFTP}
              weight={result1?.profile.weight}
              regdata={result2?.hardknott}
            />
             <Image
              src={"/images/hardknott.jpeg"}
              width={341}
              height={227}
              alt="Picture of the author"
              style={{
                height: "227px",
                width: "341px"
              }}
             
              className="hover:shadow-2xl shadow-inner block"
            />
          </div>
         
            </div>
          <div className="w-full flex flex-col px-12">
          <div className="w-10/12  my-12">
            <RidechartRegression
              regdata={result2?.scotland}
              cyclingpbs={result1?.user.cyclingpbs}
              weight={result1?.profile.weight}
              ftp={result1?.user.cyclingFTP}
            />
            
          </div>
          <div className="flex flex-row py-8">
          <Image
              src={"/images/balach.jpg"}
              width={460}
              height={306}
              alt="Picture of the author"
             
              className="hover:shadow-2xl shadow-inner"
            />
            <p className="pl-8 text-lg">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ab quisquam unde, repellendus atque quibusdam expedita sint repudiandae quia dolore distinctio. Placeat dicta ipsam at similique sapiente itaque quam repellendus laudantium!</p>
            </div>
          </div>
          <div className="flex flex-row flex-wrap justify-around">
          <div className="w-5/12  my-12">
            <HeartRate
               hr={result1?.user.bikeHrZones}
            />
            <p className="py-8 text-lg">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Deleniti neque necessitatibus fugit possimus error qui dolorum mollitia, earum tempore iste odio fuga sunt iure porro. Nulla quibusdam nostrum sit aliquam.</p>
          </div>
          <div className="w-5/12 my-12">
            <FtpChart
               ftp={result1?.user.cyclingFTP}
            />
            <p className="py-8 text-lg">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Deleniti neque necessitatibus fugit possimus error qui dolorum mollitia, earum tempore iste odio fuga sunt iure porro. Nulla quibusdam nostrum sit aliquam.</p>
          </div>
          </div>
        </>
      )}
    </div>
  );
}

export default IsAuth(Page)