import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3000/api",

});

export const apiSlice = createApi({
  baseQuery,

  tagTypes: ["Activities"],
  endpoints: (builder) => ({}),
});
