/**
 * User Slice - User authentication and profile state
 * @module store/userSlice
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types';

interface UserState {
  /** Current user profile */
  user: User | null;
  /** JWT auth token */
  token: string | null;
  /** Authentication state */
  isAuthenticated: boolean;
  /** Loading state */
  isLoading: boolean;
  /** Error message */
  error: string | null;
}

const initialState: UserState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
    setUserLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setUserError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    updateUserProfile(state, action: PayloadAction<Partial<User>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
});

export const {
  setUser,
  setToken,
  setUserLoading,
  setUserError,
  updateUserProfile,
  logout,
} = userSlice.actions;

export default userSlice.reducer;
