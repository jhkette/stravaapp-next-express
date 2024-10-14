import { apiSlice } from "./apiSlice";
import Cookies from "js-cookie";
import { Activity, Stats } from "./types";
function getToken() {
  const token = Cookies.get("token");
  console.log(token);
  if (token) {
    return token;
  }
  return null;
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
  friend: any;
  follower: any;
}

interface HrZones {
  zone1: [number, number];
  zone2: [number, number];
  zone3: [number, number];
  zone4: [number, number];
  zone5: [number, number];
}

export interface CyclingPbs {
  "15": number;
  "30": number;
  "60": number;
  "90": number;
  "120": number;
  "150": number;
  "180": number;
  "210": number;
  "240": number;
  "270": number;
  "300": number;
  "330": number;
  "360": number;
  "390": number;
  "410": number;
  "440": number;
  "480": number;
  "600": number;
  "720": number;
  "900": number;
  "1200": number;
  "1800": number;
  "2700": number;
  "3600": number;
}

export interface RunningPbs {
  400: number | null;
  800: number | null;
  1000: number | null;
  2414: number | null;
  3000: number | null;
  5000: number | null;
  10000?: number | null;
}
export interface DataPoint {
  x: number;
  y: number;
}

export interface Route {
  _id: string;
  name: string;
  dataset: DataPoint[];
  __v: number;
}

export interface RideChartRegressionProps {
  regdata: Route[]
 cyclingpbs: CyclingPbs;
  weight: number;
  ftp: number;
}

// Define props interface for power data
export interface PowerData {
  cyclingpbs: CyclingPbs; // Assuming cyclingpbs is an object with time (as string) and power values
    cyclingFTP: number; // Functional threshold power
  }
  
  // Define props interface for the component
  export interface LineChartProps {
    power: PowerData;
  }

  // export interface RunningPbs {
  //   400: number | null;
  //   800: number | null;
  //   1000: number | null;
  //   2414: number | null;
  //   3000: number | null;
  //   5000: number | null;
  //   10000?: number | null;
  // }


  

interface AthleteData {
  activities: Activity[]; // Array of activity objects
  athlete_id: number; // ID of the athlete
  bikeHrZones: HrZones; // Heart rate zones for cycling
  cyclingFTP: number; // Functional Threshold Power for cycling
  cyclingMaxHr: number; // Maximum heart rate for cycling
  cyclingpbs: CyclingPbs; // Personal best power values for cycling
  runHrZones: HrZones; // Heart rate zones for running
  runningMaxHr: number; // Maximum heart rate for running
  runningpbs: RunningPbs; // Personal best times for running
}

interface Athlete {
  profile: UserProfile;
  user: AthleteData;
  stats: Stats
}



interface Datasets {
  half: [Route];
  hardknott: [Route];
  marathon: [Route];
  scotland: [Route];
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
    getDatasets: builder.query<Datasets, void>({
      query: () => ({
        url: "/data/datasets",
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

export const {
  useGetLatestQuery,
  useGetUserQuery,
  useGetDatasetsQuery,
  useLogoutMutation,
} = userApiSlice;
