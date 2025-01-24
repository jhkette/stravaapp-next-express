export interface Activity {
  resource_state: number;
  athlete: {
    id: number;
    resource_state: number;
  };
  name: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  type: string;
  sport_type: string;
  workout_type: string | null;
  id: number;
  start_date: string;
  start_date_local: string;
  timezone: string;
  utc_offset: number;
  location_city: string | null;
  location_state: string | null;
  location_country: string;
  achievement_count: number;
  kudos_count: number;
  comment_count: number;
  athlete_count: number;
  photo_count: number;
  map: {
    id: string;
    summary_polyline: string;
    resource_state: number;
  };
  trainer: boolean;
  commute: boolean;
  manual: boolean;
  private: boolean;
  visibility: string;
  flagged: boolean;
  gear_id: string;
  start_latlng: [number, number];
  end_latlng: [number, number];
  average_speed: number;
  max_speed: number;
  average_temp: number;
  average_watts: number;
  kilojoules: number;
  device_watts: boolean;
  has_heartrate: boolean;
  average_heartrate?: number;
  max_heartrate?: number;
  heartrate_opt_out?: boolean;
  display_hide_heartrate_option?: boolean;
  elev_high?: number;
  elev_low?: number;
  upload_id: number;
  upload_id_str: string;
  external_id: string;
  from_accepted_tag: boolean;
  pr_count: number;
  total_photo_count: number;
  has_kudoed: boolean;
  tss?: number;
}

export interface ActivityTotals {
  count: number;
  distance: number; // in meters
  moving_time: number; // in seconds
  elapsed_time: number; // in seconds
  elevation_gain: number; // in meters
  achievement_count?: number; // optional, only for recent activities
}

export interface Stats {
  biggest_ride_distance: number; // in meters
  biggest_climb_elevation_gain: number; // in meters
  recent_ride_totals: ActivityTotals;
  all_ride_totals: ActivityTotals;
  recent_run_totals: ActivityTotals;
  all_run_totals: ActivityTotals;
  recent_swim_totals: ActivityTotals;
  all_swim_totals: ActivityTotals;
  ytd_ride_totals: ActivityTotals;
  ytd_run_totals: ActivityTotals;
  ytd_swim_totals: ActivityTotals;
}

export interface HeartRateZones {
  zone1: [number, number];
  zone2: [number, number];
  zone3: [number, number];
  zone4: [number, number];
  zone5: [number, number];
}

export interface AthleteData {
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

export interface Athlete {
  profile: UserProfile;
  user: AthleteData;
  stats: Stats;
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
  "15": number|null
  "30": number|null
  "60": number|null
  "90": number|null
  "120": number|null
  "150": number|null
  "180": number|null
  "210": number|null
  "240": number|null
  "270": number|null
  "300": number|null
  "330": number|null
  "360": number|null
  "390": number|null
  "410": number|null
  "440": number|null
  "480": number|null
  "600": number|null
  "720": number|null
  "900": number|null
  "1200": number|null
  "1800": number|null
  "2700": number|null
  "3600": number|null
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

export interface Datasets {
  half: [Route];
  hardknott: [Route];
  marathon: [Route];
  scotland: [Route];
}

export interface Route {
  _id: string;
  name: string;
  dataset: DataPoint[];
  __v: number;
}

export interface RideChartRegressionProps {
  regdata: Route[];
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
