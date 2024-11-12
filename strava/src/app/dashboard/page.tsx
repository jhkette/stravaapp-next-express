"use client";
import { useSelector } from "react-redux";
import type { RootState } from "../../lib/store";
import { useGetUserQuery, useGetLatestQuery } from "@/lib/activitySlice";
import { intervalToDuration } from "date-fns";
import Header from "../ui/header";
import IsAuth from "../IsAuth";
function Page() {
  const auth = useSelector((state: RootState) => state.authorisation.auth);

  const { data: result1, isError, isLoading, isSuccess } = useGetUserQuery();

  const {
    data: res2,
    isError: error2,
    isLoading: load2,
    isSuccess: succcess2,
  } = useGetLatestQuery(
    Date.parse(
      result1!?.user.activities[result1!?.user.activities.length - 1][
        "start_date_local"
      ]
    ) / 1000,
    { skip: !result1?.user }
  );

  const getKm = () => {
    if (result1) {
      return (
        result1?.user?.activities.slice(-5).reduce((acc, activities) => {
          return acc + activities.distance;
        }, 0) / 1000
      );
    }
  };

  const getCalories = () => {
    if (result1) {
      return result1?.user?.activities.slice(-5).reduce((acc, activities) => {
        return acc + activities.kilojoules;
      }, 0);
    }
  };
  const getTime = () => {
    if (result1) {
      const seconds = result1?.user?.activities
        .slice(-5)
        .reduce((acc, activities) => {
          return acc + activities.elapsed_time;
        }, 0);
      const time = intervalToDuration({ start: 0, end: seconds * 1000 });
      return time;
    }
  };
  const formatDuration = (duration: any) => {
    if (result1) {
      const hours = String(duration.hours).padStart(2, "0");
      const minutes = String(duration.minutes).padStart(2, "0");
      const seconds = String(duration.seconds).padStart(2, "0");
      return `${hours}:${minutes}:${seconds}`;
    }
  };

  const formattedTime = formatDuration(getTime());

  return (
    <div className="flex flex-col  w-full px-24">
      <Header />
      {isSuccess && (
        <>
          <h2 className="text-xl py-8 font-bold">Last 5 activities</h2>

          <table className="w-[650px]  p-8 bg-blue-100 rounded-sm border-collapse">
            <thead>
              <tr>
                <th className="border-b py-2 px-4 text-left">Metric</th>
                <th className="border-b py-2 px-4 text-left">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-gray-50">
                <td className="py-2 px-4">Km travelled</td>
                <td className="py-2 px-4">{getKm()}</td>
              </tr>
              <tr>
                <td className="py-2 px-4">Calories burnt</td>
                <td className="py-2 px-4">{getCalories()}</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="py-2 px-4 text-left">Time spent</td>
                <td className="py-2 px-4 text-left">{formattedTime}</td>
              </tr>
            </tbody>
          </table>

          <div className="flex flex-row justify-start gap-10">
            <div>
              <h2 className="text-xl py-8 font-bold">Total distances ran/cycled</h2>
              <table className="w-72 bg-blue-100 rounded-sm border-collapse">
                <thead>
                  <tr>
                    <th className="border-b py-2 px-4 text-left">Metric</th>
                    <th className="border-b py-2 px-4 text-left">
                      Value (miles)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-gray-50">
                    <td className="py-2 px-4">Run total distance</td>
                    <td className="py-2 px-4">
                      {Math.floor(
                        result1.stats.all_run_totals.distance / 1609.3
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4">Ride total distance</td>
                    <td className="py-2 px-4">
                      {Math.floor(
                        result1.stats.all_ride_totals.distance / 1609.3
                      )}
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="py-2 px-4">Biggest ride distance</td>
                    <td className="py-2 px-4">
                      {Math.floor(result1.stats.biggest_ride_distance / 1609.3)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <h2 className="text-xl py-8 font-bold">Cycling power PBs</h2>
              <table className="w-72 p-8 bg-blue-100 rounded-sm border-collapse">
                <thead>
                  <tr>
                    <th className="border-b py-2 px-4 text-left">Time</th>
                    <th className="border-b py-2 px-4 text-left">Cycling PB</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-gray-50">
                    <td className="py-2 px-4">15 seconds</td>
                    <td className="py-2 px-4">
                      {result1.user.cyclingpbs["15"]}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4">30 seconds</td>
                    <td className="py-2 px-4">
                      {result1.user.cyclingpbs["30"]}
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="py-2 px-4">1 minute</td>
                    <td className="py-2 px-4">
                      {result1.user.cyclingpbs["60"]}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4">2 minutes</td>
                    <td className="py-2 px-4">
                      {result1.user.cyclingpbs["120"]}
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="py-2 px-4">3 minutes</td>
                    <td className="py-2 px-4">
                      {result1.user.cyclingpbs["180"]}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4">5 minutes</td>
                    <td className="py-2 px-4">
                      {result1.user.cyclingpbs["300"]}
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="py-2 px-4">10 minutes</td>
                    <td className="py-2 px-4">
                      {result1.user.cyclingpbs["600"]}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4">20 minutes</td>
                    <td className="py-2 px-4">
                      {result1.user.cyclingpbs["1200"]}
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="py-2 px-4">30 minutes</td>
                    <td className="py-2 px-4">
                      {result1.user.cyclingpbs["1800"]}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default IsAuth(Page);
