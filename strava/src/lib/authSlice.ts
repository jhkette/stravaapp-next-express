

import { createSlice } from "@reduxjs/toolkit";

export interface AuthState {
  auth: boolean;
}
const initialState: AuthState = {
  auth: false,
};

export const authSlice = createSlice({
  name: "authorisation",
  initialState,
  reducers: {
    authorise: (state) => {
      state.auth = true;
    },
    deauthorise: (state) => {
      state.auth = false;
    },
  },
});

export const { authorise, deauthorise } = authSlice.actions;

export default authSlice.reducer;
