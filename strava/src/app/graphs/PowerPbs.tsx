import React from 'react'
import { useGetUserQuery,  } from "@/lib/activitySlice";
export default function PowerPbs() {

      const { data: result1, isError, isLoading, isSuccess } = useGetUserQuery();
  return (
    
    <div>
        {result1?.user.cyclingpbs["15"] &&
        <div>
              <h2 className="text-xl py-8 font-bold">Cycling power PBs</h2>
              <table className="w-64 p-8 bg-blue-100 rounded-sm border-collapse">
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
}
          </div>

  
  )
}
