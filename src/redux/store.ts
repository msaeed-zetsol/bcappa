import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./user/userSlice";
import membersSlice from "./members/membersSlice";

export const store = configureStore({
  reducer: {
    users: userSlice,
    members: membersSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
