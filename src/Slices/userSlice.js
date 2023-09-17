import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector, shallowEqual } from "react-redux";
import { useActions } from "../Hooks/useAction";

export const initialState = {
  id: null,
  name: null,
  email: null,
  password: null,
  token: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetState: () => {
      return initialState;
    },
    setUser: (state, action) => {
      console.log("👑", action.payload);
      state.id = action.payload._id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.token = action.payload.token;
    },
  },
});

export const actions = userSlice.actions;

export const useUserStateActions = () => useActions({ actions });

const userSelector = (state) => state.user;
export const useUserState = () => useSelector(userSelector, shallowEqual);

export default userSlice.reducer;
