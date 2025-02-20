import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db/connect";
import RunDataSet from "@/models/RunDataSet";
import RideDataSet from "@/models/RideDataSet";
import mongoose from "mongoose";
export async function GET(request: Request) {
  connectDb();

  new RideDataSet({
    name: "Bealach-na-ba",
    dataset: [
      {
        x: 5.52,
        y: 1746,
      },
      {
        x: 4.64,
        y: 1806,
      },
      {
        x: 5.43,
        y: 1810,
      },
      {
        x: 4.145,
        y: 1860,
      },
      {
        x: 4.472,
        y: 1964,
      },
      {
        x: 5.5,
        y: 2141,
      },
      {
        x: 4.76,
        y: 2192,
      },
      {
        x: 4.03,
        y: 2236,
      },
      {
        x: 3.6,
        y: 2387,
      },
      {
        x: 3.4,
        y: 2409,
      },
      {
        x: 4.01,
        y: 2454,
      },
      {
        x: 4.1,
        y: 2527,
      },
      {
        x: 7.08,
        y: 1471,
      },
      {
        x: 5.68,
        y: 1610,
      },
      {
        x: 5.16,
        y: 1629,
      },
      {
        x: 5.52,
        y: 1752,
      },
      {
        x: 4.75,
        y: 1779,
      },
      {
        x: 5.42,
        y: 1794,
      },
      {
        x: 5.475,
        y: 1822,
      },
      {
        x: 5.01,
        y: 1851,
      },
      {
        x: 4.67,
        y: 1890,
      },
      {
        x: 4.65,
        y: 1905,
      },
      {
        x: 5.16,
        y: 1910,
      },
      {
        x: 4.62,
        y: 1930,
      },
      {
        x: 5.04,
        y: 1935,
      },
      {
        x: 4.67,
        y: 1968,
      },
      {
        x: 4.24,
        y: 1968,
      },
      {
        x: 4.75,
        y: 1969,
      },
      {
        x: 4.86,
        y: 1980,
      },
      {
        x: 4.62,
        y: 2001,
      },
      {
        x: 4.49,
        y: 2017,
      },
      {
        x: 4.6,
        y: 2022,
      },
      {
        x: 4.32,
        y: 2045,
      },
      {
        x: 4.4,
        y: 2046,
      },
      {
        x: 4.03,
        y: 2056,
      },
      {
        x: 4.72,
        y: 2061,
      },
      {
        x: 3.37,
        y: 2062,
      },
      {
        x: 4.31,
        y: 2088,
      },
      {
        x: 3.86,
        y: 2089,
      },
      {
        x: 4,
        y: 2091,
      },
      {
        x: 4.29,
        y: 2096,
      },
      {
        x: 5.45,
        y: 1599,
      },
      {
        x: 5.35,
        y: 1739,
      },
      {
        x: 5.08,
        y: 1806,
      },
      {
        x: 4.87,
        y: 1848,
      },
      {
        x: 4.9,
        y: 1877,
      },
      {
        x: 4.7,
        y: 1897,
      },
      {
        x: 4.35,
        y: 1919,
      },
      {
        x: 4.38,
        y: 1943,
      },
      {
        x: 4.35,
        y: 1947,
      },
      {
        x: 4.32,
        y: 1950,
      },
      {
        x: 4.53,
        y: 1952,
      },
      {
        x: 4.28,
        y: 1963,
      },
      {
        x: 4.22,
        y: 2015,
      },
      {
        x: 4.52,
        y: 2019,
      },
      {
        x: 4.09,
        y: 2021,
      },
      {
        x: 4.464,
        y: 2028,
      },
      {
        x: 4.11,
        y: 2032,
      },
      {
        x: 4.25,
        y: 2041,
      },
      {
        x: 4.15,
        y: 2050,
      },
      {
        x: 4.45,
        y: 2081,
      },
      {
        x: 3.92,
        y: 2106,
      },
      {
        x: 3.3,
        y: 2135,
      },
      {
        x: 3.65,
        y: 2146,
      },
      {
        x: 3.8,
        y: 2150,
      },
      {
        x: 3.35,
        y: 2190,
      },
      {
        x: 3.58,
        y: 2192,
      },
      {
        x: 3.71,
        y: 2215,
      },
      {
        x: 3.6,
        y: 2233,
      },
      {
        x: 3.37,
        y: 2246,
      },
      {
        x: 3.53,
        y: 2252,
      },
      {
        x: 3.58,
        y: 2266,
      },
      {
        x: 3.28,
        y: 2289,
      },
      {
        x: 3.5,
        y: 2302,
      },
      {
        x: 3.16,
        y: 2381,
      },
      {
        x: 3.15,
        y: 2689,
      },
      {
        x: 2.81,
        y: 2736,
      },
      {
        x: 2.81,
        y: 2759,
      },
      {
        x: 3.23,
        y: 2353,
      },
      {
        x: 3.25,
        y: 2467,
      },
      {
        x: 3.15,
        y: 2495,
      },
      {
        x: 3.13,
        y: 2503,
      },
      {
        x: 3.11,
        y: 2504,
      },
      {
        x: 2.88,
        y: 2512,
      },
      {
        x: 3.13,
        y: 2514,
      },
      {
        x: 2.82,
        y: 2520,
      },
      {
        x: 2.91,
        y: 2525,
      },
    ],
  }).save();
  return NextResponse.json({ msg: "hello" });
}
