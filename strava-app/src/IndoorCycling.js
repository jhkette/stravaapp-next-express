import React from "react";

import IndoorRidechartRegression from "./components/IndoorRideChartRegression.js";

// indoor cycling page
export default function IndoorCycling({ userRecords, alpe, box, ftp, weight }) {
  return (
    <section className="min-h-screen w-full py-4 px-24">
      <section className="w-full pt-16">
        <h2 className="text-2xl font-bold mb-8">
          Predicting your climbing indoors
        </h2>
        <p className="text-lg pb-8">
          Climbing is an important part of cycling - indoors and outdoors. Here,
          I have used two datasets from zwift. Knowing how fast you can expect
          to climb up these segments can be important for pacing during a race.
        </p>
        <h2 className="pb-4">Alpe du Zwift - Predicted Time</h2>
        <IndoorRidechartRegression
          regdata={alpe}
          userRecords={userRecords}
          weight={weight}
          ftp={ftp}
        />
        <div className="flex flex-wrap w-full py-8  justify-between">
          <div className=" w-5/12 h-80 bg-[url('./images/alpe.jpg')]  bg-no-repeat bg-cover bg-center border-8 border-slate-300"></div>
          <div className="w-7/12 pl-8">
          
            <p className="text-lg">
              Modeled after France’s infamous Alpe d’Huez, Alpe du Zwift was the
              biggest climb in game when it was introduced in March 2018. Zwift
              created this route using GPS data to perfectly match the incline
              and distance of the storied climb and its 21 hairpin turns. This
              is the most notorious climb in the game - the graph below should
              let you know if you can get the much coveted in game badge if you
              complete it in under an hour.
            </p>
          </div>
        </div>
      </section>

      <section className="w-full pt-16">
      <h2 className="pb-4">Box Hill - Predicted Time</h2>
        <IndoorRidechartRegression
          regdata={box}
          userRecords={userRecords}
          weight={weight}
          ftp={ftp}
        />
        <div className="flex flex-wrap w-full py-8  justify-between">
          <div className="w-7/12 pr-8">
            <p className="text-lg">
              {" "}
              The most popular climb in London, Box Hill is a GPS-accurate
              replica of the famous IRL climb. This climb often appears in races
              - and knowing roughly what time you can expect to complete it
              could be invaluable.
            </p>
          </div>
          <div className=" w-5/12 h-80  bg-[url('./images/boxhill.jpeg')]  bg-no-repeat bg-cover bg-center border-8 border-slate-300"></div>
        </div>
      </section>
    </section>
  );
}
