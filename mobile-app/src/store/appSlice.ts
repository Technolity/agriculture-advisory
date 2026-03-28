/**
 * App Slice - Global application state
 * Handles network status, sync state, language, and loading
 * @module store/appSlice
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NetworkStatus, SyncStatus, AppLanguage } from '../types';

interface AppState {
  /** Current network connectivity status */
  networkStatus: NetworkStatus;
  /** Current sync queue processing status */
  syncStatus: SyncStatus;
  /** Number of pending sync items */
  pendingSyncCount: number;
  /** Selected app language */
  language: AppLanguage;
  /** Global loading indicator */
  isLoading: boolean;
  /** Last successful sync timestamp */
  lastSyncAt: string | null;
  /** App initialization complete */
  isInitialized: boolean;
  /** Error message for display */
  globalError: string | null;
}

const initialState: AppState = {
  networkStatus: 'unknown',
  syncStatus: 'idle',
  pendingSyncCount: 0,
  language: 'en',
  isLoading: false,
  lastSyncAt: null,
  isInitialized: false,
  globalError: null,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setNetworkStatus(state, action: PayloadAction<NetworkStatus>) {
      state.networkStatus = action.payload;
    },
    setSyncStatus(state, action: PayloadAction<SyncStatus>) {
      state.syncStatus = action.payload;
    },
    setPendingSyncCount(state, action: PayloadAction<number>) {
      state.pendingSyncCount = action.payload;
    },
    setLanguage(state, action: PayloadAction<AppLanguage>) {
      state.language = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setLastSyncAt(state, action: PayloadAction<string>) {
      state.lastSyncAt = action.payload;
    },
    setInitialized(state, action: PayloadAction<boolean>) {
      state.isInitialized = action.payload;
    },
    setGlobalError(state, action: PayloadAction<string | null>) {
      state.globalError = action.payload;
    },
    clearGlobalError(state) {
      state.globalError = null;
    },
  },
});

export const {
  setNetworkStatus,
  setSyncStatus,
  setPendingSyncCount,
  setLanguage,
  setLoading,
  setLastSyncAt,
  setInitialized,
  setGlobalError,
  clearGlobalError,
} = appSlice.actions;

export default appSlice.reducer;
