import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db/connect";
import RunDataSet from "@/models/RunDataSet";
import RideDataSet from "@/models/RideDataSet";
import mongoose from "mongoose";
import {client} from "@/lib/client";

export async function GET(request: Request) {
    const link = client.getAuthorizationUri();
    return NextResponse.json({ link: link});

}