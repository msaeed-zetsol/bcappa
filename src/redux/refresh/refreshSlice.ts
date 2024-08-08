import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type RefreshState = {
  home: boolean;
  myBcs: boolean;
};

const initialState: RefreshState = {
  home: false,
  myBcs: false,
};

const slice = createSlice({
  name: "refresh",
  initialState: initialState,
  reducers: {
    updateRefreshState: (state, action: PayloadAction<RefreshState>) =>
      action.payload,
  },
});

export const { updateRefreshState } = slice.actions;
export default slice.reducer;
