import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NODE_API,

});

export const apiSlice = createApi({
  baseQuery,

  tagTypes: ["Activities"],
  endpoints: (builder) => ({}),
});
