import React from "react";

import { Link } from "react-router-dom";
import { Bicycle, PersonSimpleRun, SignOut, Calendar } from "phosphor-react";
import { useAuth } from "../context/AuthContext";

// sidebar component - contains links to other pages depending on auth status
export default function Sidebar({
  logout,
  userActivities,
}) {
  const { auth } = useAuth();
  return (
    <div className="h-auto w-4/12 bg-slate-200 min-h-screen">
      <nav className="flex flex-col py-16 px-8 ml-8">
      <div className="flex flex-row justify-start items-center py-2 border-b border-gray-300 border-dashed">
  <div className="w-10">
  <Calendar size={32} />
  </div>
  <p className="p-2 text-lg">
    <Link to="/"> Home </Link>
  </p>
</div>
        {!!userActivities.length && (
          <div className="flex flex-row justify-start items-center py-2 border-b border-gray-300 border-dashed">
            <div className="w-10">
              <Bicycle size="32" />
            </div>
            <p className="p-2 text-lg">
              <Link to="/cycling"> Cycling</Link>
            </p>
          </div>
        )}
        {!!userActivities.length && (
        <div className="flex flex-row justify-start items-center py-2 border-b border-gray-300 border-dashed">
            <div className="w-10">
              <PersonSimpleRun size={32} />
            </div>
            <p className=" p-2 text-lg">
              <Link to="/running"> Running</Link>
            </p>
          </div>
        )}

        {auth && (
           <div className="flex flex-row justify-start items-center py-2 border-b border-gray-300 border-dashed">
            <div className="w-10">
            <SignOut size={32} />
            </div>
            <p className=" p-2 text-lg cursor-pointer" onClick={logout}>
              Logout
            </p>
          </div>
        )}

     
      </nav>
    </div>
  );
}
