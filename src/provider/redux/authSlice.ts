import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  user_id: string | null;
  name: string | null;
  lastname: string | null;
  email: string | null;
  role: string | null;
}

const initialState: UserState = {
  user_id: null,
  name: null,
  lastname: null,
  email: null,
  role: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      return { ...state, ...action.payload };
    },
    clearUser: () => initialState,
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
