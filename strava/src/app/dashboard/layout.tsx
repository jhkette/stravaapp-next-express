"use client";
import Cookies from "js-cookie";
import {  useEffect,} from "react";
import SideNav from "../ui/sidenav";
import { authorise, deauthorise } from "../../lib/authSlice";
import { useDispatch } from "react-redux";


export default function Dashboardlayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {


  const dispatch = useDispatch();

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      dispatch(authorise());
    }
  }, [dispatch]);

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between">
        <SideNav />
        {children}
      </div>
    </div>
  );
}
