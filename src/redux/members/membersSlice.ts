import {createSlice} from '@reduxjs/toolkit';

const membersSlice = createSlice({
  name: 'members',
  initialState: [], // The initial state is an empty array
  reducers: {
    setMembers: (state, action) => {
      return action.payload; // Replace the members array with the payload
    },
    addMember: (state: any, action: any) => {
      console.log({action});
      action && state.push(action.payload); // Add a new member to the state
    },
    removeMember: (state, action) => {
      const emailToRemove = action.payload.email;
      return state.filter((member: any) => member.email !== emailToRemove);
    },
    updateMembersOrder: (state, action) => {
      console.log({update_state: state});
      console.log({update_action: action.payload});
      return action.payload; // Replace members array with the reordered array
    },
  },
});

export const {setMembers, addMember, removeMember, updateMembersOrder} =
  membersSlice.actions;
export default membersSlice.reducer;
