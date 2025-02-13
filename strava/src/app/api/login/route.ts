

import { NextResponse } from "next/server";
import {client} from "@/lib/client";

export async function GET(request: Request) {
 
    return NextResponse.redirect(client.getAuthorizationUri());

}