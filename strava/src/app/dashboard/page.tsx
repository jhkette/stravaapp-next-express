"use client";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import SideNav from "../ui/sidenav";
import { increment, decrement, incrementByAmount } from "../../lib/slice";
import { authorise, deauthorise } from "../../lib/authSlice";
import styles from "./page.module.css";
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
  const [logout, { error }] = useLogoutMutation();
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      dispatch(authorise());
    }
  }, []);

  const pressLogout = async () => {
    const res = await logout();
    dispatch(deauthorise());
    router.push("/");
  };

  const count = useSelector((state: RootState) => state.counter.value);
  const auth = useSelector((state: RootState) => state.authorisation.auth);
  const dispatch = useDispatch();
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

  // console.log(res2);

  // console.log(result1, "THIS IS GET ATHLETE", auth, "THIS IS AUTH");

  return (
    <div className="flex flex-row">
      <SideNav />
      <div>
        <button className={styles.button} onClick={() => dispatch(increment())}>
          Increment
        </button>

        <span>{count}</span>
        <button className={styles.button} onClick={() => dispatch(decrement())}>
          Decrement
        </button>
        <button
          className={styles.button}
          onClick={() => dispatch(incrementByAmount(2))}
        >
          Increment by 2
        </button>

        <button className={styles.button} onClick={pressLogout}>
          logaout
        </button>
      </div>
      {isSuccess && `logged in as ${result1.profile?.firstname}`}
      {isSuccess && (
        <Image
          src={result1?.profile?.profile}
          alt=""
          width="80"
          height="80"
          style={{ width: "80px", height: "80px" }} // optional
        />
      )}
    </div>
  );
}
