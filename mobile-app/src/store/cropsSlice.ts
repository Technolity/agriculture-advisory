/**
 * Crops Slice - Crop data state management
 * @module store/cropsSlice
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Crop, Disease } from '../types';

interface CropsState {
  /** All cached crops */
  crops: Crop[];
  /** Currently selected crop */
  selectedCrop: Crop | null;
  /** Diseases for selected crop */
  diseases: Disease[];
  /** Loading state */
  isLoading: boolean;
  /** Error message */
  error: string | null;
  /** Last fetch timestamp */
  lastFetchedAt: string | null;
}

const initialState: CropsState = {
  crops: [],
  selectedCrop: null,
  diseases: [],
  isLoading: false,
  error: null,
  lastFetchedAt: null,
};

const cropsSlice = createSlice({
  name: 'crops',
  initialState,
  reducers: {
    setCrops(state, action: PayloadAction<Crop[]>) {
      state.crops = action.payload;
      state.lastFetchedAt = new Date().toISOString();
    },
    setSelectedCrop(state, action: PayloadAction<Crop | null>) {
      state.selectedCrop = action.payload;
    },
    setDiseases(state, action: PayloadAction<Disease[]>) {
      state.diseases = action.payload;
    },
    setCropsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setCropsError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    clearCrops(state) {
      state.crops = [];
      state.selectedCrop = null;
      state.diseases = [];
    },
  },
});

export const {
  setCrops,
  setSelectedCrop,
  setDiseases,
  setCropsLoading,
  setCropsError,
  clearCrops,
} = cropsSlice.actions;

export default cropsSlice.reducer;
