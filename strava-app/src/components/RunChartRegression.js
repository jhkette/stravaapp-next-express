import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import regression from "regression";
import { intervalToDuration } from "date-fns";
import { Spinner } from "phosphor-react";

/**
 *
 * This returns a regression chart runs
 * the actual graph is constrcuted in the useffect function
 * I have had to create several checks that the relevant data is present
 * then I construct the chart - it gets passed as a parameter to the canvas
 *
 */
export default function RunchartRegression({ userRecords, event, regdata }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const regData = regdata[0].dataset.map(({ x, y }) => {
    return [parseInt(x), parseInt(y)]; // we need a list of [[x1, y1], [x2, y2], ...]
  });
  let my_regression;
  let prediction;
  if (userRecords.runningpbs["5000"]) {
    my_regression = regression.linear(regData); //create linear regression

    prediction = my_regression.predict(userRecords.runningpbs["5000"])[1];
  }

  useEffect(() => {
    if (!userRecords.runningpbs["5000"] || !regdata) {
      return;
    }
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const myChartRef = chartRef.current.getContext("2d");
    // create  a new chart
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
            enabled: false, // <-- this option disables tooltips
          },
          annotation: {
            annotations: {
              point1: {
                type: "point",
                xValue: userRecords.runningpbs["5000"],
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
                size: "14pts",
                family: "lato",
              },
              callback: (val) => {
                if (val < 60) {
                  return `${val} seconds`;
                }
                const remainder = val % 60;
                const minutes = (val - remainder) / 60;
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
              family: "lato",
              color: "#1a1a1a",
              font: {
                size: "14pts",
              },
              callback: (val) => {
                if (val < 60) {
                  return `${val} seconds`;
                }
                const remainder = val % 60;
                const minutes = (val - remainder) / 60;
                if (val < 60) {
                  return `${minutes}mins`;
                }
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
  }, [userRecords, prediction, regData, my_regression.points, event, regdata]);

  /**
   * Returns human readable time as an object {hh:mm} or {mm:ss}
   */

  function humanDuration(timeInSeconds) {
    const duration = intervalToDuration({
      start: 0,
      end: timeInSeconds * 1000,
    });
    const { hours, minutes, seconds } = duration;

    return {
      hours: hours || 0,
      minutes: minutes < 10 ? `0${minutes}` : `${minutes}`,
      seconds: seconds < 10 ? `0${seconds}` : `${seconds}`,
    };
  }

  function getPace(time, event) {
    const distanceMiles = event === "Half Marathon" ? 13.1 : 26.2;
    const distanceKm = event === "Half Marathon" ? 20.09 : 42.2;

    const pacePerMile = humanDuration(time / distanceMiles);
    const pacePerKm = humanDuration(time / distanceKm);

    return [pacePerMile, pacePerKm];
  }

  if (!userRecords?.runningpbs) {
    return (
      <p>
        <Spinner size={32} />
      </p>
    );
  }

  const predFormat = humanDuration(prediction);
  const fivekFormat = humanDuration(userRecords.runningpbs["5000"]);
  const [pacePerMile, pacePerKm] = getPace(prediction, event);

  return (
    <div className="bg-white m-auto p-8">
      <canvas ref={chartRef} style={{ width: "300px", height: "200px" }} />
      <article className="flex flex-col">
        <h3 className="border-b-2 border-rose-500 text-xl mb-4">
          Predictions and Pacing
        </h3>

        <p className="text-lg">
          Your 5 km personal best: {fivekFormat.minutes}:{fivekFormat.seconds}
        </p>

        <p className="text-lg">
          {event} prediction: {predFormat.hours}:{predFormat.minutes}
        </p>

        <p className="text-lg">
          Recommended pace: {pacePerMile.minutes}:{pacePerMile.seconds} per mile
          or {pacePerKm.minutes}:{pacePerKm.seconds} per km
        </p>
      </article>
    </div>
  );
}
