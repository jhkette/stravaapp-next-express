import React from "react";

import RidechartRegression from "./components/RideChartRegression";

// cycling page
export default function IndoorCycling({
  userRecords,
  alpe,
  box,
  ftp,
  weight,
}) {
  if (!userRecords.cyclingpbs["1200"]) {
    return (
      <section className="min-h-screen px-24">
        <div className="pb-16">
          <h2>Please add at least one 30 mins effort with a power meter</h2>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen w-full py-4 px-24">
      <section className="w-full pt-16">
        <h2 className="text-2xl font-bold mb-8">Predicting your climbing</h2>
        <p className="text-lg pb-8">
          Climbing is an important part of cycling. Here, I have used two
          datasets from Strava segments. These are short routes that Strava
          times to create a leaderboard. Bealach-na-ba represents your climbing
          ability over longer periods, whereas Hardknott pass is a shorter climb
          - that should take between 10 and 20 minutes.
        </p>
        <RidechartRegression
          regdata={alpe}
          userRecords={box}
          weight={weight}
          ftp={ftp}
        />
        <div className="flex flex-wrap w-full py-8  justify-between">
          <div className=" w-5/12 h-80 bg-[url('./images/balach.jpg')]  bg-no-repeat bg-cover bg-center border-8 border-slate-300"></div>
          <div className="w-7/12 pl-8">
            <h3>Bealach na Bà</h3>
            <p className="text-lg">
              Located in the Scottish highlands, Bealach na Bà is one of
              Britain's highest roads. This climb takes 25-45 minutes and will
              represent a threshold effort for most people.
            </p>
          </div>
        </div>
      </section>

      <section className="w-full pt-16">
        <RidechartRegression
          regdata={alpe}
          userRecords={userRecords}
          weight={weight}
          ftp={ftp}
        />
        <div className="flex flex-wrap w-full py-8  justify-between">
          <div className="w-7/12 pr-8">
            <h3>Hardknott pass</h3>
            <p className="text-lg">
              {" "}
              Hardknott pass is a climb in the Lake District with gradients of
              up to 30%. It is a shorter climb that should represent something
              between a 10 and 20 minute max effort.
            </p>
          </div>
          <div className=" w-5/12 h-80  bg-[url('./images/hardknott2.jpg')]  bg-no-repeat bg-cover bg-center border-8 border-slate-300"></div>
        </div>
      </section>
    </section>
  );
}
