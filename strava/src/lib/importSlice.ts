

import { createSlice } from "@reduxjs/toolkit";

export interface ImportState {
  import: boolean;
}
const initialState: ImportState = {
  import: true,
};

export const importSlice = createSlice({
  name: "import",
  initialState,
  reducers: {
    setimporttrue: (state) => {
      state.import = true;
    },
    setimportfalse: (state) => {
      state.import = false;
    },
  },
});

export const {setimporttrue, setimportfalse} = importSlice.actions;

export default importSlice.reducer;
