import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: Member[] = [];

const membersSlice = createSlice({
  name: "members",
  initialState,
  reducers: {
    setMembers: (_, action: PayloadAction<Member[]>) => action.payload,
    addMember: (state, action: PayloadAction<Member>) => [
      ...state,
      action.payload,
    ],
    removeMember: (state, action: PayloadAction<number>) =>
      state.filter((member) => member.openingPrecedence !== action.payload),
  },
});

export const { setMembers, addMember, removeMember } = membersSlice.actions;
export default membersSlice.reducer;
