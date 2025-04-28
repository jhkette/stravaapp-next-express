import React from "react";
import { useAuth } from "../context/AuthContext";
import powered from "../images/powered.png";

export default function Footer({id}) {
  const { auth } = useAuth();
  return (
    <footer className="flex   px-24 justify-end align-center">
      {auth && (
        <div className="w-72 flex flex-col justify-end items-end">
          <img src={powered} alt="Logo" className="h-12 w-72" />
          <p className="text-orange-800 mr-4 pb-4">
            {" "}
            {id && (
              <a
                href={`https://www.strava.com/athletes/${id}`}
                target="_blank"
                rel="noreferrer"
              >
                {" "}
                View your profile on Strava{" "}
              </a>
            )}
          </p>
        </div>
      )}
    </footer>
  );
}
