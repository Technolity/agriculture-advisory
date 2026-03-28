/**
 * Redux Store Configuration
 * @module store/store
 */

import { configureStore } from '@reduxjs/toolkit';
import appReducer from './appSlice';
import cropsReducer from './cropsSlice';
import diseaseReducer from './diseaseSlice';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    app: appReducer,
    crops: cropsReducer,
    disease: diseaseReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable values in certain actions
        ignoredActions: ['disease/setCurrentImage'],
        ignoredPaths: ['disease.currentImage'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
