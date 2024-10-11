import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import regression, { Result as RegressionResult } from "regression";
import { intervalToDuration, Duration } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

// Define types for props
interface Record {
  runningpbs: {
    [key: string]: number;
  };
}

interface DatasetItem {
  x: number;
  y: number;
}

interface RegressionData {
  dataset: DatasetItem[];
}

interface RunchartRegressionProps {
  userRecords: Record;
  event: string;
  regdata: RegressionData[];
}

export default function RunchartRegression({
  runningpbs,
  event,
  regdata,
}: RunchartRegressionProps) {

  console.log(runningpbs, event, regdata , "JHNKJANSDKJ")



  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  const regData = regdata.map(({ x, y }) => [parseInt(x.toString()), parseInt(y.toString())]);

  let my_regression: RegressionResult | null = null;
  let prediction: number | undefined;

  if (runningpbs["5000"]) {
    my_regression = regression.linear(regData);
    prediction = my_regression.predict(runningpbs["5000"])[1];
  }

  useEffect(() => {
    if (!runningpbs["5000"] || !regdata) {
      return;
    }
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const myChartRef = chartRef.current?.getContext("2d");
    if (!myChartRef || !my_regression) return;

    chartInstance.current = new Chart(myChartRef, {
      type: "line",
      data: {
        labels: regData.map((item) => item[0]),
        datasets: [
          {
            type: "line",
            label: `5k-${event} dataset`,
            data: regData.map((item) => item[1]),
            fill: false,
            borderColor: "rgb(54, 162, 235)",
            showLine: false,
          },
          {
            type: "line",
            label: "Linear regression line",
            data: my_regression.points.map((data) => data[1]),
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            showLine: true,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            enabled: false, // Disable tooltips
          },
          annotation: {
            annotations: {
              point1: {
                type: "point",
                xValue: runningpbs["5000"],
                yValue: prediction,
                backgroundColor: "rgba(255, 99, 132, 0.25)",
              },
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "5k time",
              font: {
                family: "lato",
                weight: "bold",
                size: 22,
              },
            },
            type: "linear",
            beginAtZero: false,
            ticks: {
              stepSize: 120,
              color: "#1a1a1a",
              font: {
                size: 14,
                family: "lato",
              },
              callback: (val: number | string) => {
                const seconds = typeof val === "number" ? val : parseFloat(val);
                if (seconds < 60) {
                  return `${seconds} seconds`;
                }
                const remainder = seconds % 60;
                const minutes = (seconds - remainder) / 60;
                return `${minutes}:00`;
              },
            },
          },
          y: {
            title: {
              display: true,
              text: `${event} time`,
              font: {
                weight: "bold",
                size: 22,
              },
            },
            ticks: {
              stepSize: 120,
              color: "#1a1a1a",
              font: {
                size: 14,
                family: "lato",
              },
              callback: (val: number) => {
                if (val < 60) {
                  return `${val} seconds`;
                }
                const remainder = val % 60;
                const minutes = (val - remainder) / 60;
                let hoursRemainder = minutes % 60;
                const hours = (minutes - hoursRemainder) / 60;
                if (hoursRemainder < 10) {
                  hoursRemainder = `0${hoursRemainder}`;
                }
                return `${hours}:${hoursRemainder}`;
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
  }, [runningpbs, prediction, regData, my_regression, event, regdata]);

  function humanDuration(time: number): Duration {
    const times = intervalToDuration({ start: 0, end: time * 1000 });
    return {
      ...times,
      minutes: times.minutes && times.minutes < 10 ? `0${times.minutes}` : times.minutes,
      seconds: times.seconds && times.seconds < 10 ? `0${times.seconds}` : times.seconds,
    };
  }

  function getPace(time: number, event: string) {
    let pace: number;
    let pace2: number;
    if (event === "Half Marathon") {
      pace = time / 13.1;
      pace2 = time / 20.09;
    } else {
      pace = time / 26.2;
      pace2 = time / 42.2;
    }
    return [humanDuration(pace), humanDuration(pace2)];
  }

  let fivekFormat: Duration | null = null;
  let predFormat: Duration | null = null;
  let recPace: Duration[] | null = null;

  if (prediction && runningpbs) {
    predFormat = humanDuration(prediction);
    fivekFormat = humanDuration(runningpbs["5000"]);
    recPace = getPace(prediction, event);
  }

  return runningpbs ? (
    <div className="bg-white m-auto p-8">
      <canvas ref={chartRef} style={{ width: "300px", height: "200px" }} />
      <article className="flex flex-col">
        <h3 className="border-b-2 border-rose-500 text-xl mb-4">Predictions and pacing</h3>
        <p className="text-lg ">
          Your five km personal best: {fivekFormat?.minutes}:{fivekFormat?.seconds}
        </p>
        <p className="text-lg ">
          {event} prediction: {predFormat?.hours}:{predFormat?.minutes}
        </p>
        <p className="text-lg">
          Recommended pace: {recPace?.[0].minutes}:{recPace?.[0].seconds} per/mile
          or {recPace?.[1].minutes}:{recPace?.[1].seconds} per/km
        </p>
      </article>
    </div>
  ) : (
    <p>Loading...</p>
  );
}