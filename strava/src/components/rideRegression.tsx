import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import regression, { DataPoint, Result } from "regression";
import { intervalToDuration, Duration } from "date-fns";
import {RideChartRegressionProps} from "@/types/types"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";



const RidechartRegression: React.FC<RideChartRegressionProps> = ({
  regdata,
  cyclingpbs ,
  weight,
  ftp,
}) => {


  let predWkg: number | undefined;
  let pbLevel: string | undefined;

  if (cyclingpbs && weight && regdata.length > 0) {
    const rideName = regdata[0]["name"];

    if (rideName === "Bealach-na-ba") {
      if (cyclingpbs["1200"] / weight >= 6.5) {
        predWkg = cyclingpbs["1200"];
        pbLevel = "your best 20 minute power";
      } else if (cyclingpbs["1800"] / weight >= 5) {
        predWkg = cyclingpbs["1800"];
        pbLevel = "your best 30 minute power";
      } else if (ftp / weight >= 4) {
        predWkg = ftp / weight;
        pbLevel = "your FTP level power";
      } else {
        predWkg = (ftp / weight) * 0.9;
        pbLevel = "90% of your FTP level power";
      }
    } else if (rideName === "Hardknott pass") {
      if (cyclingpbs["480"] / weight >= 6.8) {
        predWkg = cyclingpbs["480"] / weight;
        pbLevel = "your best 8 minute power";
      } else if (cyclingpbs["600"] / weight >= 5.9) {
        predWkg = cyclingpbs["600"] / weight;
        pbLevel = "your best 10 minute power";
      } else if (cyclingpbs["720"] / weight >= 4.4) {
        predWkg = cyclingpbs["720"] / weight;
        pbLevel = "your best 12 minute power";
      } else if (cyclingpbs["900"] / weight >= 3.2) {
        predWkg = cyclingpbs["900"] / weight;
        pbLevel = "your best 15 minute power";
      } else {
        predWkg = cyclingpbs["1200"] / weight;
        pbLevel = "your best 20 minute power";
      }
    }
  }

  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  let regData: [number, number][] = [];
  let finalScatter: { x: number; y: number }[] = [];
  let expRegression: Result;
  let prediction: number | undefined;
  let formattedPred: Duration | undefined;
  let sorted: DataPoint[] = [];

  if (regdata.length > 0) {
    regData = regdata[0]["dataset"].map(({ x, y }) => [
      Number(x),
      Number(y)
    ]);

    finalScatter = regData.map((item) => ({ x: item[0], y: item[1] }));

    expRegression = regression.polynomial(regData);

    if (predWkg !== undefined) {
      prediction = Math.round(expRegression.predict(predWkg)[1]);
      sorted = [...expRegression.points].sort((a, b) => a[0] - b[0]);
      formattedPred = intervalToDuration({ start: 0, end: prediction * 1000 });
    }
  }

  useEffect(() => {
    if (!regdata || !chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const myChartRef = chartRef.current.getContext("2d");
    if (!myChartRef) return;

    chartInstance.current = new Chart<"line" | "scatter", { x: number, y: number }[]>(myChartRef, {
      type: "scatter",
      data: {
        labels: sorted.map((data) => data[0]), // x-values for the line dataset
        datasets: [
          {
            type: "line",
            label: "Polynomial regression",
            data: sorted.map((data) => ({ x: data[0], y: data[1] })), // Provide both x and y values as objects for the line
            borderColor: "#00897b",
            backgroundColor: "#00897b88",
            showLine: true,
          },
          {
            type: "scatter",
            label: `${regdata[0]["name"]} dataset`,
            data: finalScatter, // This should be an array of {x, y} points
            fill: false,
            borderColor: "rgb(54, 162, 235)",
            showLine: false,
          },
        ],
      },
      options: {
        elements: {
          point: {
            radius: 3,
          },
        },
        maintainAspectRatio: true,
        responsive: true,
        plugins: {
          tooltip: {
            enabled: false,
          },
          annotation: {
            annotations: {
              point1: {
                type: "point",
                xValue: predWkg,
                yValue: prediction,
                borderColor: "#000",
                backgroundColor: "#00000088",
              },
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Watts/kg of bodyweight",
              font: {
                family: "Inter, sans-serif",
                size: 18,
              },
            },
            suggestedMin: 1,
            beginAtZero: false,
            ticks: {
              color: "#1a1a1a",
              font: {
                family: "Inter, sans-serif",
                size: 12,
              },
            },
          },
          y: {
            title: {
              display: true,
              text: `${regdata[0]["name"]} time (hh:mm)`,
              font: {
                family: "Inter, sans-serif",
                size: 18,
              },
            },
            grace: "15%",
            ticks: {
              stepSize: 10,
              color: "#1a1a1a",
              font: {
                family: "Inter, sans-serif",
                size: 12,
              },
              callback: (val) => {
                const numVal = Number(val); // Coerce val to a number
                if (numVal < 60) return `${numVal} seconds`;
                const remainder = numVal % 60;
                const minutes = Math.floor(numVal / 60);
                const hours = Math.floor(minutes / 60);
                const formattedMinutes = minutes % 60;
                return hours > 0
                  ? `${hours}:${formattedMinutes < 10 ? `0${formattedMinutes}` : formattedMinutes}`
                  : `0:${formattedMinutes}`;
              },
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  });

  return regdata.length ? (
    <div className="w-11/12 rounded-xl bg-white p-8">
      <canvas ref={chartRef} className="w-full" />
      {formattedPred && (
        <p className="border-b-2 my-4 border-green-800 text-lg inline-block text-l font-bold">
          Your predicted time is:{" "}
          {formattedPred.hours ? formattedPred.hours : ""}{" "}
          {formattedPred.minutes}:{formattedPred.seconds && formattedPred.seconds < 10
            ? "0" + formattedPred.seconds
            : formattedPred.seconds}
        </p>
      )}
      <p className="text-lg">
        This calculation is based on you holding {pbLevel} for the duration of the ride.
      </p>
    </div>
  ) : (

    <p>
      <FontAwesomeIcon icon={faSpinner} spinPulse />
    </p>
  );

};

export default RidechartRegression;