import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { Session } from "@supabase/supabase-js"

// State: keep session + role
interface SessionState {
  session: Session | null
  role: string
}

const initialState: SessionState = {
  session: null,
  role: "visitor", // default role
}

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<{ session: Session | null; role: string }>) => {
      state.session = action.payload.session
      state.role = action.payload.role
    },
    clearSession: (state) => {
      state.session = null
      state.role = "visitor"
    },
    updateRole: (state, action: PayloadAction<string>) => {
      state.role = action.payload
    },
  },
})

export const { setSession, clearSession, updateRole } = sessionSlice.actions
export default sessionSlice.reducer
