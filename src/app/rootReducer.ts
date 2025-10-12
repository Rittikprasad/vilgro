import { combineReducers } from "@reduxjs/toolkit";
import { authSlice } from "../features/auth/authSlice.js";
import metaReducer from "../features/meta/metaSlice.js";
import signupReducer from "../features/signup/signupSlice.js";
import onboardingReducer from "../features/onboarding/onboardingSlice.js";
import assessmentReducer from "../features/assessment/assessmentSlice.js";


export const rootReducer = combineReducers({
  auth: authSlice.reducer,
  meta: metaReducer,
  signup: signupReducer,
  onboarding: onboardingReducer,
  assessment: assessmentReducer,
});
