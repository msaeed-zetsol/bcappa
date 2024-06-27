import {configureStore} from '@reduxjs/toolkit';
import userSlice from './user/userSlice';
import membersSlice  from './members/membersSlice';

export const store = configureStore({
  reducer: {
    users: userSlice,
    members: membersSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
