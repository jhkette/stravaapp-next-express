"use client";
import Cookies from "js-cookie";
import { redirect } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import StravaImage from "../../public/strava.png";

import { authorise } from "../lib/authSlice";

import axios from "axios";

import { useEffect, useState } from "react";

export default function Home() {
  const [link, setLink] = useState("");
  const dispatch = useDispatch();
  const baseURL = "http://localhost:3000/api"
  // const fetcher = url => axios.get(url, config).then(res => res.data)
  // const { userData, error, isLoading } = useSWR(baseURL + "/user/athlete", fetcher)

  
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/link")
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
  }, [dispatch]);

  return (
    <div className="flex bg-hero bg-no-repeat bg-cover bg-bottom">
      <main className="flex min-h-screen flex-row items-center justify-center p-24 w-full">
        <div className="w-[550px] mt-8">
         
          <a href={link && link} className="">
            <Image
              src={"/images/strava.png"}
              width={386}
              height={96}
              alt="Picture of the author"
              style={{ width: 255, height: 63.66 }}
              className="hover:shadow-2xl shadow-inner"
            />
          </a>
          <p className="text-white font-bold text-xl leading-relaxed">
            Please login by pressing the connect button to analyse your strava{" "}
          </p>
        </div>
      </main>
    </div>
  );
}
