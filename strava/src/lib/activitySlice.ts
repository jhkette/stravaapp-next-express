import { apiSlice } from "./apiSlice";
import Cookies from "js-cookie";
import { Route, Datasets, Athlete, CyclingPbs } from "./types";

function getToken() {
  const token = Cookies.get("token");
  console.log(token);
  if (token) {
    return token;
  }
  return null;
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
