import React from "react";
import EventCalendar from "./components/Calender";
import { useAuth } from "./context/AuthContext";
import logo from "./images/strava.png";
//  landing page with activity calender

/*
 * The landing page is either the login pages
 * or the calender page
 */
export default function Landing({
  userActivities,
  link,
  message,
  importData,
  fetched,
}) {
  const { auth } = useAuth();

  return (
    <>
      {auth === false && !userActivities.length && (
        <main className="min-h-screen bg-[url('./images/balach_cover.jpeg')] bg-no-repeat bg-cover bg-center bg-fixed flex flex-col content-center justify-center">
          <div className="px-32 py-4 ">
            <div className="p-8 rounded-md bg-gray-300 ">
              {link && (
                <a href={link} className="text-white">
                  <img src={logo} alt="logo" className="h-16" />
                </a>
              )}

              <p className="opacity-100  text-base ">
                Please click connect with Strava. For this app to work best you
                should upload a mixture of running and cycling to Strava.
                Ideally, you should upload at least one 10k run and some hard
                cycling efforts, with a power meter, of between 12 and 20
                minutes. Also ensure you have a weight attached to your profile.
                It is under Settings {">"} My Profile in strava.
              </p>
            </div>
          </div>
        </main>
      )}

      {auth && !userActivities.length && fetched && (
        <div className="flex flex-row justify-start items-center py-16">
          <div className="w-10"></div>
          <div className="p-6 my-6">
            <p className=" text-gray-600 font-base">
              If this is your first time logging in - please click import. This
              will retrieve data from Strava. Your future activities will then
              be added automatically.
            </p>
            <button
              className="bg-blue-400 my-6 px-16 py-3 rounded-md hover:bg-green-700 hover:text-white transition ease-in-out hover:bg-blue-900"
              onClick={importData}
            >
              {message ? "importing" : "import"}
            </button>
          </div>
        </div>
      )}

      {auth && !!userActivities.length && (
        <main className="min-h-screen">
          <div className="px-24 py-16">
            <EventCalendar userActivities={userActivities} />
          </div>
        </main>
      )}
    </>
  );
}
