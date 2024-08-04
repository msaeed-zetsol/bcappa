import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

export interface UserState {
  InfoModals: {
    value?: boolean;
    message?: string;
    buttonText?: string;
    onPress?: any;
  };
  ranges: {
    low?: number;
    high?: number;
  };
  ErrorModal: {
    message?: string;
    value?: boolean;
  };
  removeUser: [];
}
const initialState: UserState = {
  InfoModals: {
    value: false,
    message: '',
    buttonText: '',
    onPress: null,
  },
  ranges: {
    low: 0,
    high: 5000,
  },
  ErrorModal: {
    message: '',
    value: false,
  },
  removeUser: [],
};
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateTheModelValue: (state, action: PayloadAction<any>) => {
      state.InfoModals.value = action.payload.value;
      state.InfoModals.message = action.payload.message;
      state.InfoModals.buttonText = action.payload.buttonText;
      state.InfoModals.onPress = action.payload.onPress;
    },
    rangeValues: (state, action: PayloadAction<any>) => {
      state.ranges.low = action.payload.low;
      state.ranges.high = action.payload.high;
    },
    setErrors: (state, action: PayloadAction<any>) => {
      state.ErrorModal.message = action.payload.message;
      state.ErrorModal.value = action.payload.value;
    },
    removeMembers: (state: any, action: PayloadAction<any>) => {
      console.log({ action: state.removeUser });
      return {
        ...state,
        removeUser: [...state.removeUser, action.payload],
      };
    },
  },
});

export const {
  updateTheModelValue,
  rangeValues,
  setErrors,
  removeMembers,
} = userSlice.actions; //you can use this in update.js to send paylods to this update reducer

export default userSlice.reducer; //use this in store
