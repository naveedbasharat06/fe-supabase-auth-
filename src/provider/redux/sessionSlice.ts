import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { Session } from "@supabase/supabase-js"

// State: keep session + role
interface SessionState {
  session: Session | null
  user_role: string
}

const initialState: SessionState = {
  session: null,
  user_role: "visitor", // default role
}

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<{ session: Session | null; user_role: string }>) => {
      state.session = action.payload.session
      state.user_role = action.payload.user_role
    },
    clearSession: (state) => {
      state.session = null
      state.user_role = "visitor"
    },
    updateRole: (state, action: PayloadAction<string>) => {
      state.user_role = action.payload
    },
  },
})

export const { setSession, clearSession, updateRole } = sessionSlice.actions
export default sessionSlice.reducer
