import { combineReducers } from "@reduxjs/toolkit";
import { authSlice } from "../features/auth/authSlice.js";
import metaReducer from "../features/meta/metaSlice.js";
import signupReducer from "../features/signup/signupSlice.js";
import onboardingReducer from "../features/onboarding/onboardingSlice.js";
import assessmentReducer from "../features/assessment/assessmentSlice.js";
import questionBuilderReducer from "../features/question-builder/questionBuilderSlice.js";
import adminDashboardReducer from "../features/adminDashboard/adminDashboardSlice.js";
import adminSpoReducer from "../features/adminSpo/adminSpoSlice.js";
import adminBankReducer from "../features/adminBank/adminBankSlice.js";
import adminReviewsReducer from "../features/adminReviews/adminReviewsSlice.js";
import adminDetailsReducer from "../features/adminDetails/adminDetailsSlice.js";
import adminActivityLogReducer from "../features/adminActivityLog/adminActivityLogSlice.js";


export const rootReducer = combineReducers({
  auth: authSlice.reducer,
  meta: metaReducer,
  signup: signupReducer,
  onboarding: onboardingReducer,
  assessment: assessmentReducer,
  questionBuilder: questionBuilderReducer,
  adminDashboard: adminDashboardReducer,
  adminSpo: adminSpoReducer,
  adminBank: adminBankReducer,
  adminReviews: adminReviewsReducer,
  adminDetails: adminDetailsReducer,
  adminActivityLog: adminActivityLogReducer,
});
