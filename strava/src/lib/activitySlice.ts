import { apiSlice } from "./apiSlice";
import { getToken } from "../util/getToken";
import { Route, Datasets, Athlete, CyclingPbs } from "../types/types";





// https://stackoverflow.com/questions/68561750/how-to-add-headers-to-endpoints-in-rtk-query-plugin
export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    logout: builder.mutation<Object, void>({
      query: () => ({
        url: `http://localhost:8080/api/logout`,
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
        url: "http://localhost:8080/api/rundata",
        method: "GET",

        headers: { Authorization: `Bearer ${getToken()}` },
      }),
    }),
  
  }),
});

export const {

  useGetUserQuery,
  useGetDatasetsQuery,
  useLogoutMutation,
} = userApiSlice;
