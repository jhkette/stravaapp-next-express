import { configureStore, createSlice } from "@reduxjs/toolkit";
import { authSlice } from "./authSlice";
import {importSlice} from "./importSlice"
import { apiSlice } from "./apiSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      authorisation: authSlice.reducer,
      import: importSlice.reducer,
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    //concat(apiSlice.middleware) adds apislice middleware
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true,
  });
};

export const store = makeStore();

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
