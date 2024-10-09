"use client";
import Cookies from "js-cookie";
import { Children, useEffect, useState } from "react";
import SideNav from "../ui/sidenav";
import { authorise, deauthorise } from "../../lib/authSlice";
import { useDispatch } from "react-redux";
import {
  useLogoutMutation
} from "@/lib/activitySlice";
import { useRouter } from "next/navigation";

export default function Dashboardlayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  const [logout, { error }] = useLogoutMutation();
  const router = useRouter();

  const dispatch = useDispatch();

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      dispatch(authorise());
    }
  }, []);

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between">
        <SideNav />
        {children}
      </div>
    </div>
  );
}
