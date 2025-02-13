import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  // Clear the "token" cookie
  cookies().delete('token');

  // Return a JSON response
  return NextResponse.json({ msg: 'logged out successfully' });
}