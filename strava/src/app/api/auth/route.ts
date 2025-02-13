

// exports.authorisation = async (req, res) => {
//     const errors = {};
//     const token = await client.getToken(req.originalUrl);
//     if (!token) {
//       errors["error"] = "unable to login";
//       return res.status(400).send(errors);
//     }
  
//     res.cookie("token", token.access_token,  {expires: new Date(Date.now() + 1800000)});
//     return res.redirect(process.env.ORIGIN);
//   };

//   GET

import { NextResponse, NextRequest } from "next/server";
import { connectDb } from "@/lib/db/connect";
import RunDataSet from "@/models/RunDataSet";
import RideDataSet from "@/models/RideDataSet";
import mongoose from "mongoose";
import {client} from "@/lib/client";

export async function GET(request: Request) {
    const errors = {};
    const url = new URL(request.url);
    const token = await client.getToken(url.toString()); 
     // Create a response object
     const response = NextResponse.redirect(process.env.ORIGIN || '/');

     // Set cookie (equivalent to res.cookie)
     response.headers.set('Set-Cookie', `token=${token.access_token}; Path=/; HttpOnly; Max-Age=1800; Secure; SameSite=Strict`);
 
     return response;

}