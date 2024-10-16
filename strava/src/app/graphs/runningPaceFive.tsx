import React from "react";
import annotationPlugin from "chartjs-plugin-annotation";

import { intervalToDuration } from "date-fns";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Plugin,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { RunningPbs } from "@/lib/activitySlice";
// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  annotationPlugin,
  Title,
  Tooltip,
  Legend
);


interface LineChartProps {
 
    runningpbs: RunningPbs;
  
}

const RunningFive: React.FC<LineChartProps> = ({ runningpbs }) => {
  if (!runningpbs) {
    return (
      <div>
        <p>
        loading
        </p>
      </div>
    );
  }
 
  const finaldata: number[] = [];
   console.log(runningpbs)
  // Define floatingLabels plugin with correct typing
  const floatingLabels: Plugin<"line"> = {
    id: "floatingLabels",
    afterDatasetDraw(chart) {
      if(runningpbs[10000]){
      const { ctx, scales: { x, y } } = chart;
      ctx.save();
      ctx.textAlign = "center";
      ctx.fillStyle = "#0d5f96";
      ctx.font = "1rem Lato";
      const finalx = x.getPixelForValue(5000);
      const finaly = y.getPixelForValue(runningpbs[10000] / 10 + 5);
      ctx.fillText("Critical pace estimate", finalx, finaly);
      }
    },
  };

  // Compute pace per km for each distance in `runningpbs`
  const timeObj = runningpbs;
  for (const key in timeObj) {
    // Ensure that 'key' is treated as a key of RunningPbs
    //@ts-ignore
    const mins = timeObj[key as keyof RunningPbs];
  
    // Parse 'key' as a number for distance calculation
    const distance = Number(key) / 1000;
    const speed = distance / mins!;
    const perKm = 1 / speed;
    finaldata.push(perKm);
  }
  const labels = Object.keys(runningpbs);

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Running pace chart",
      },
     
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => {
            const duration = intervalToDuration({
              start: 0,
              end: tooltipItem.formattedValue * 1000,
            });

            let perKmPaceSeconds: string = duration.seconds?.toString() || '0';
            if (duration.seconds === undefined || duration.seconds < 10) {
              perKmPaceSeconds = `0${duration.seconds || '0'}`;
            }

            return `${duration.minutes}:${perKmPaceSeconds} per/km`;
          },
          title: (tooltipItems: any) => {
            const tooltipItem = tooltipItems[0];
            return `${tooltipItem.label} metres`;
          },
        },
      },
    },
    scales: {
      x: {
        type: "linear" as const,
        beginAtZero: true,
        ticks: {
          stepSize: 500,
          color: "#1a1a1a",
          font: {
            family: "Lato",
            size: 14,
          },
        },
        title: {
          display: true,
          text: "Distance in metres",
          font: {
            family: "Lato",
            size: 20,
          },
        },
      },
      y: {
        reverse: true,
        title: {
          display: true,
          text: "Best pace (mins per km)",
          font: {
            family: "Lato",
            size: 20,
          },
        },
        ticks: {
          stepSize: 30,
          font: {
            family: "Lato",
            size: 14,
          },
          callback: (val: any) => {
            if (val < 60) {
              return val;
            }
            const remainder = val % 60;
            const minutes = (val - remainder) / 60;
            if (remainder !== 0) {
              return `${minutes}:${remainder}`;
            }
            return `${minutes}:00`;
          },
        },
        beginAtZero: false,
      },
    },
  };

  const chartData = {
    labels,
    datasets: [
      {
        label: "Best pace",
        data: finaldata,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
      },
    ],
  };
 
  return <Line options={options} data={chartData} plugins={[floatingLabels]} className="bg-white p-4" />;
};

export default RunningFive;