"use client";
import Cookies from "js-cookie";
import {  useEffect,} from "react";
import SideNav from "@/app/ui/topnav";
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
   
      <div className="min-h-screen h-full flex flex-col justify-between ">
        <SideNav />
        <div className="w-full h-full">
        {children}
        </div>
      </div>
 
  );
}
