"use client";
import Cookies from "js-cookie";
import { redirect } from "next/navigation";
import { useDispatch, useSelector } from 'react-redux';

import {authorise } from "../lib/authSlice";

import axios from "axios";

import { useEffect, useState } from "react";

export default function Home() {
  const [link, setLink] = useState("");
  const dispatch = useDispatch()
  const baseURL = "http://localhost:3000/api";
  // const fetcher = url => axios.get(url, config).then(res => res.data)
  // const { userData, error, isLoading } = useSWR(baseURL + "/user/athlete", fetcher)

  useEffect(() => {
    axios
      .get(baseURL + "/auth/link")
      .then((res) => setLink(res.data.link))
      .catch((err) => {
        console.log(err);
      });
  }, [baseURL]);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      dispatch(authorise());
      redirect("/dashboard");
    }
  }, []);

  return (
    <div className="flex">
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <a href={link && link} className="">
          <div className="">Link to Strava</div>
        </a>
      </main>
    </div>
  );
}
