import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './rootReducer.js';

/**
 * Redux store configuration
 * Uses the root reducer to combine all feature slices
 */
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
