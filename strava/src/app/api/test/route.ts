import { NextResponse } from "next/server";
// import mongoose from "mongoose";

export async function GET(request: Request) {
    
    return NextResponse.json({ message: "Email successfully sent" });
}