import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { rootReducer } from './rootReducer.js';

/**
 * Redux persist configuration
 * Defines which parts of the state to persist and storage options
 */
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'onboarding'], // ✅ Persist auth and onboarding
};

/**
 * Persisted root reducer
 * Wraps the root reducer with persistence functionality
 */
const persistedReducer = persistReducer(persistConfig, rootReducer);

/**
 * Redux store configuration
 * Uses the persisted root reducer to combine all feature slices with persistence
 */
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

/**
 * Redux persist store
 * Used to trigger rehydration and persistence operations
 */
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
