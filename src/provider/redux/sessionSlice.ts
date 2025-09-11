import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Session } from "@supabase/supabase-js";

type SupaSession = Session | null;

interface SessionState {
  session: SupaSession;
}

const initialState: SessionState = {
  session: null,
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<SupaSession>) => {
      state.session = action.payload;
    },
    clearSession: (state) => {
      state.session = null;
    },
  },
});

export const { setSession, clearSession } = sessionSlice.actions;
export default sessionSlice.reducer;
