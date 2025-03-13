import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import UserActivities from '@/models/UserActivities'; // Adjust import as needed

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization');
  console.log(token, 'called api');

  if (!token) {
    return NextResponse.json({ error: 'Permission not granted' }, { status: 401 });
  }

  try {
    const { data: athlete } = await axios.get('https://www.strava.com/api/v3/athlete', {
      headers: { Authorization: token },
    });

    const athleteId = parseInt(athlete.id);

    const { data: athleteStats } = await axios.get(`https://www.strava.com/api/v3/athletes/${athleteId}/stats`, {
      headers: { Authorization: token },
    });

    console.log(athleteStats, 'athlete stats');

    const foundUserActs = await UserActivities.findOne({ athlete_id: athleteId });

    console.log(foundUserActs, 'found user acts');

    if (foundUserActs?._id) {
      console.log("THIS IS RUNNING , USER EXISTS");
      return NextResponse.json({ profile: athlete, user: foundUserActs, stats: athleteStats }, { status: 200 });
    }

    const newUser = new UserActivities({ athlete_id: athleteId });
    const userToSave = await newUser.save();
  
    return NextResponse.json({ profile: athlete, user: userToSave, stats: athleteStats }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}