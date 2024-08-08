import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./user/userSlice";
import membersSlice from "./members/membersSlice";
import refreshSlice from "./refresh/refreshSlice";

export const store = configureStore({
  reducer: {
    users: userSlice,
    members: membersSlice,
    refresh: refreshSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
