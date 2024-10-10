import { apiSlice } from "./apiSlice";
import Cookies from "js-cookie";
import { Activity } from "./types";
function getToken() {
  const token = Cookies.get("token");
  console.log(token);
  if (token) {
    return token;
  }
  return null
}



interface UserProfile {
  id: number;
  username: string;
  resource_state: number;
  firstname: string;
  lastname: string;
  bio: string;
  city: string;
  state: string;
  country: string;
  sex: string;
  premium: boolean;
  summit: boolean;
  created_at: string;
  updated_at: string;
  badge_type_id: number;
  weight: number;
  profile_medium: string;
  profile: string;
  friend: any; // Adjust this based on what type 'friend' should be
  follower: any; // Adjust this based on what type 'follower' should be
}

interface HrZones {
  zone1: [number, number];
  zone2: [number, number];
  zone3: [number, number];
  zone4: [number, number];
  zone5: [number, number];
}

interface CyclingPbs {
  15: string;
  30: string;
  60: string;
  90: string;
  120: string;
  150: string;
  180: string;
  210: string;
  240: string;
  270: string;
  300: string;
  330: string;
  360: string;
  390: string;
  410: string;
  440: string;
  480: string;
  600: string;
  720: string;
  900: string;
  1200: string;
  1800: string;
  2700: string;
  3600: string;
}

interface RunningPbs {
  400: number | null;
  800: number | null;
  1000: number | null;
  2414: number | null;
  3000: number | null;
  5000: number | null;
  10000?: number | null;
}

interface AthleteData {
  activities: Activity[];        // Array of activity objects
  athlete_id: number;            // ID of the athlete
  bikeHrZones: HrZones;          // Heart rate zones for cycling
  cyclingFTP: number;            // Functional Threshold Power for cycling
  cyclingMaxHr: number;          // Maximum heart rate for cycling
  cyclingpbs: CyclingPbs;        // Personal best power values for cycling
  runHrZones: HrZones;           // Heart rate zones for running
  runningMaxHr: number;          // Maximum heart rate for running
  runningpbs: RunningPbs;        // Personal best times for running
}


interface Athlete {
  profile: UserProfile
  user: AthleteData
}

// https://stackoverflow.com/questions/68561750/how-to-add-headers-to-endpoints-in-rtk-query-plugin
export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    logout: builder.mutation<Object, void>({
      query: () => ({
        url: `/auth/logout`,
        method: "GET",
      }),
    }),
    getUser: builder.query<Athlete, void>({
      query: () => ({
        url: "/user/athlete",
        method: "GET",

        headers: { Authorization: `Bearer ${getToken()}` },
      }),
    }),
    getLatest: builder.query({
      
      query: (data) => ({
       
        url: `/user/activities/${data}`,
        method: "GET",
        headers: { Authorization: `Bearer ${getToken()}` },
      }),
    }),
  }),
});

export const { useGetLatestQuery, useGetUserQuery, useLogoutMutation } = userApiSlice;
