import { combineReducers } from "@reduxjs/toolkit";
import { authSlice } from "../features/auth/authSlice.js";
import metaReducer from "../features/meta/metaSlice.js";

/**
 * Root reducer that combines all feature reducers
 * This provides a single point of configuration for all reducers
 */
export const rootReducer = combineReducers({
  auth: authSlice.reducer,
  meta: metaReducer,
});
