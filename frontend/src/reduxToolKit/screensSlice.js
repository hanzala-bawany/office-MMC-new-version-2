import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  screen1: null,
  screen3: null,
  screen4: null,
};

const screensSlice = createSlice({
  name: "screens",
  initialState,
  reducers: {
    setScreenData: (state, action) => {
      const { screen, data } = action.payload;
      state[screen] = data;
    },

    clearScreenData: (state, action) => {
      const screen = action.payload;
      state[screen] = null;
    },
  },
});

export const { setScreenData, clearScreenData } = screensSlice.actions;
export default screensSlice.reducer;
