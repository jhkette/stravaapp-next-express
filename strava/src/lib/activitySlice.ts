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

interface activity{
  start_date_local: string
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

interface Athlete {
  profile: UserProfile
  user: {
    activities: Activity[]
  },
  

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
