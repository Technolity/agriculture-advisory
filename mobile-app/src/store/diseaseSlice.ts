/**
 * Disease Slice - Disease detection state management
 * @module store/diseaseSlice
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DiseaseDetection } from '../types';

interface DiseaseState {
  /** History of disease detections */
  detections: DiseaseDetection[];
  /** Current detection in progress */
  currentDetection: DiseaseDetection | null;
  /** Current captured image URI */
  currentImage: string | null;
  /** Detection processing state */
  isProcessing: boolean;
  /** Error message */
  error: string | null;
}

const initialState: DiseaseState = {
  detections: [],
  currentDetection: null,
  currentImage: null,
  isProcessing: false,
  error: null,
};

const diseaseSlice = createSlice({
  name: 'disease',
  initialState,
  reducers: {
    setDetections(state, action: PayloadAction<DiseaseDetection[]>) {
      state.detections = action.payload;
    },
    addDetection(state, action: PayloadAction<DiseaseDetection>) {
      state.detections.unshift(action.payload);
    },
    setCurrentDetection(state, action: PayloadAction<DiseaseDetection | null>) {
      state.currentDetection = action.payload;
    },
    setCurrentImage(state, action: PayloadAction<string | null>) {
      state.currentImage = action.payload;
    },
    setProcessing(state, action: PayloadAction<boolean>) {
      state.isProcessing = action.payload;
    },
    setDiseaseError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    clearCurrentDetection(state) {
      state.currentDetection = null;
      state.currentImage = null;
      state.error = null;
    },
  },
});

export const {
  setDetections,
  addDetection,
  setCurrentDetection,
  setCurrentImage,
  setProcessing,
  setDiseaseError,
  clearCurrentDetection,
} = diseaseSlice.actions;

export default diseaseSlice.reducer;
