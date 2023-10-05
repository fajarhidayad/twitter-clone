import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Session } from 'next-auth';

type AuthState = {
  auth: Session | null;
};

const initialState: AuthState = {
  auth: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSession(state, action: PayloadAction<Session>) {
      state.auth = action.payload;
    },
    signOutSession(state) {
      state.auth = null;
    },
  },
});

export const { setSession, signOutSession } = authSlice.actions;
export default authSlice.reducer;
