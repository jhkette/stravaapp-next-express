

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
import { cookies } from 'next/headers'
import { NextResponse, NextRequest } from "next/server";

import {client} from "@/lib/client";

export async function GET(request: Request) {
    const url = new URL(request.url);

    
    // Get the token from your client
    const token = await client.getToken(url.toString()); 
 

    // Set the cookie using the cookies function
    cookies().set('token', token.access_token, {
       
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
    });

    // Redirect the user
    return NextResponse.redirect(process.env.ORIGIN || '/');
}