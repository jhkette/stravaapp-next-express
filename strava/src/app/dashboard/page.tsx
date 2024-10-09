"use client";

import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../lib/store";
import {
  useLogoutMutation,
  useGetUserQuery,
  useGetLatestQuery,
} from "@/lib/activitySlice";
import { useRouter } from "next/navigation";

export default function Page() {
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

  console.log(res2);

  console.log(result1, "THIS IS GET ATHLETE", auth, "THIS IS AUTH");

  return (
    <div className="flex flex-col  w-full px-24">
      <div className="flex flex-col items-end">
        {isSuccess && (
          <Image
            src={result1?.profile?.profile}
            alt=""
            width="40"
            height="40"
            style={{ width: "80px", height: "80px" }} // optional
          />
        )}
        <p> {isSuccess && `logged in as ${result1.profile?.firstname}`}</p>
      </div>

      <p> {isSuccess && ` ${result1.user?.activities[0].type}`}</p>
      <p> {isSuccess && ` ${result1.user?.activities[0].type}`}</p>
      <p> {isSuccess && ` ${result1.user?.activities[0].type}`}</p>
      <p> {isSuccess && ` ${result1.user?.activities[0].type}`}</p>
      <p> {isSuccess && ` ${result1.user?.activities[0].type}`}</p>
      <p> {isSuccess && ` ${result1.user?.activities[0].type}`}</p>
    </div>
  );
}
