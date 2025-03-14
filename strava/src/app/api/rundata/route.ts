import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db/connect";
import RunDataSet from "@/models/RunDataSet";
import RideDataSet from "@/models/RideDataSet";


export async function GET(request: Request) {
  connectDb();
  const marathon = await RunDataSet.find({ name: "marathon" });
  const half = await RunDataSet.find({ name: "half marathon" });
  const hardknott = await RideDataSet.find({ name: "Hardknott pass" });
  const scotland = await RideDataSet.find({ name: "Bealach-na-ba" });
  return NextResponse.json({ marathon, half, hardknott, scotland });
}
