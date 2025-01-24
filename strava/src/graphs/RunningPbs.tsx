import React from 'react'
import { useGetUserQuery,  } from "@/lib/activitySlice";
export default function RunningPbs() {

      const { data: result1, isError, isLoading, isSuccess } = useGetUserQuery();
  return (
    
    <div>
        {result1?.user.runningpbs["10000"] && result1?.user.runningpbs["5000"] &&
        <div>
              <h2 className="text-xl py-8 font-bold">Cycling power PBs</h2>
              <table className="w-64 p-8 bg-blue-100 rounded-sm border-collapse">
                <thead>
                  <tr>
                    <th className="border-b py-2 px-4 text-left">Distance</th>
                    <th className="border-b py-2 px-4 text-left">Personal best time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-gray-50">
                    <td className="py-2 px-4">40m</td>
                    <td className="py-2 px-4">
                      {result1.user.runningpbs["400"]}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4">800m</td>
                    <td className="py-2 px-4">
                      {result1.user.runningpbs["800"]}
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="py-2 px-4">1000m</td>
                    <td className="py-2 px-4">
                      {result1.user.runningpbs["1000"]}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4">1 mile</td>
                    <td className="py-2 px-4">
                      {result1.user.runningpbs["2414"]}
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="py-2 px-4">3000m</td>
                    <td className="py-2 px-4">
                      {result1.user.runningpbs["3000"]}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4">5000m</td>
                    <td className="py-2 px-4">
                      {result1.user.runningpbs["5000"]}
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="py-2 px-4">10000m</td>
                    <td className="py-2 px-4">
                      {result1.user.runningpbs["10000"]}
                    </td>
                  </tr>
                 
                </tbody>
              </table>
            </div>
}
          </div>

  
  )
}
