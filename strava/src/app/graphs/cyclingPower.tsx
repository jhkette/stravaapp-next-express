import React from "react";
import annotationPlugin from "chartjs-plugin-annotation";
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
  ChartOptions,
  Plugin
} from "chart.js";
import { Line } from "react-chartjs-2";
import {CyclingPbs} from "../../lib/activitySlice"

// Register necessary elements for ChartJS
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



// Define props interface for power data
interface PowerData {
cyclingpbs: CyclingPbs; // Assuming cyclingpbs is an object with time (as string) and power values
  cyclingFTP: number; // Functional threshold power
}

// Define props interface for the component
interface LineChartProps {
  power: PowerData;
}

// Create the LineChart component
const LineChart: React.FC<LineChartProps> = ({ power }) => {
    console.log(power, "this is power")

    if(!power.cyclingpbs){ // if no data show spinner
        return(
          <p>Loading</p>
        )
      }
    
  // Extract labels from power data
  const labels = Object.keys(power.cyclingpbs);

  // Define the floating labels plugin
  const floatingLabels: Plugin<'line'> = {
    id: "floatingLabels",
    afterDatasetDraw(chart) {
      const { ctx, scales: { x, y } } = chart;
      ctx.save();
      ctx.textAlign = "center";
      ctx.fillStyle = "#0d5f96";
      ctx.font = ".95rem Lato";
      const finalX = x.getPixelForValue(940);
      const finalY = y.getPixelForValue(power.cyclingFTP - 60);
      ctx.fillText(
        `Functional threshold power estimate ${power.cyclingFTP}`,
        finalX,
        finalY
      );
    },
  };

  // Define chart options
  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Cycling power chart",
      },
      annotation: {
        annotations: {
          line1: {
            type: "line",
            yMin: power.cyclingFTP,
            yMax: power.cyclingFTP,
            borderColor: "#0d5f96",
            borderWidth: 3,
            borderDash: [4],
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.formattedValue} watts`,
          title: (tooltipItems) => {
            const tooltipItem = tooltipItems[0];
            console.log(tooltipItem)
            const commaStrippedLabel = tooltipItem.label.replace(/,/g, '')
            console.log(commaStrippedLabel)
            const seconds = parseInt(commaStrippedLabel) % 60;
            if (seconds === 0) {
              return `${parseInt(commaStrippedLabel) / 60} mins`;
            }
            if(parseInt(commaStrippedLabel) < 60){
                return `${commaStrippedLabel} seconds`
            }
            return `${(parseInt(commaStrippedLabel) - seconds) / 60} mins ${seconds} seconds`;
          },
        },
      },
    },
    scales: {
      x: {
        type: "linear",
        beginAtZero: true,
        ticks: {
          stepSize: 60,
          color: "#1a1a1a",
          font: {
            size: 14,
            family: "Lato",
          },
          callback: (val: string | number) => {
            const numVal = Number(val); // Convert 'val' to a number
            if (numVal < 60) return numVal.toString();
            const remainder = numVal % 60;
            const minutes = (numVal - remainder) / 60;
            return `${minutes} min`;
          },
        },
        title: {
          display: true,
          text: "Time",
          font: {
            family: "Lato",
            size: 22,
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Power in watts",
          font: {
            family: "Lato",
            size: 22,
          },
        },
        ticks: {
          font: {
            family: "Lato",
            size: 14,
          },
        },
        beginAtZero: true,
      },
    },
  };

  // Define chart data
  const data = {
    labels,
    datasets: [
      {
        label: "Best power",
        data: Object.values(power.cyclingpbs),
        borderColor: "#00897b",
        backgroundColor: "#84cec7",
      },
    ],
  };

  return <Line options={options} plugins={[floatingLabels]} data={data} className="bg-white p-4" />;
};

export default LineChart;