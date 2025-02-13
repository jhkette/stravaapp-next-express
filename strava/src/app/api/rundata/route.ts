import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db/connect";
import RunDataSet from "@/models/RunDataSet";
import RideDataSet from "@/models/RideDataSet";
import mongoose from "mongoose";

export async function GET(request: Request) {
connectDb()
  
//    console.log(t)
    const marathon = await RunDataSet.find({ name: "marathon" });
    const half = await RunDataSet.find({ name: "half marathon" });
    const hardknott= await RideDataSet.find({ name: "Hardknott pass" });
    const scotland= await RideDataSet.find({ name: "Bealach-na-ba" });
    
    // const test= await RideDataSet.find({  });
    console.log( marathon)
    return NextResponse.json({ marathon, half, hardknott, scotland });

    // return NextResponse.json({ msg: "hello" });
}


