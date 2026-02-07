import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "../../services/api";
import { endpoints } from "../../services/endpoints";
import type {
  OnboardingState,
  OnboardingProgress,
  Step2Request,
  Step3Request,
  OnboardingStepResponse,
  OnboardingFinishResponse,
  OnboardingErrorResponse,
} from "./onboardingTypes";

/**
 * Initial onboarding state
 */
const initialState: OnboardingState = {
  progress: null,
  isLoading: false,
  error: null,
  isFinishing: false,
};

/**
 * Async thunk to fetch onboarding progress
 */
export const fetchOnboardingProgress = createAsyncThunk<
  OnboardingProgress,
  void,
  { rejectValue: OnboardingErrorResponse }
>("onboarding/fetchProgress", async (_, { rejectWithValue, getState }) => {
  try {
    // Check if we have a token before making the request
    const state = getState() as { auth: { accessToken: string | null; isAuthenticated: boolean } };
    console.log("fetchOnboardingProgress - Auth state:", {
      hasToken: !!state.auth.accessToken,
      isAuthenticated: state.auth.isAuthenticated,
      token: state.auth.accessToken ? "Present" : "Missing"
    });

    // Don't make the request if we don't have a token
    if (!state.auth.accessToken) {
      console.warn("No access token available, skipping onboarding progress fetch");
      return rejectWithValue({
        message: "No access token available",
        status: 401,
        code: "NO_TOKEN"
      });
    }

    console.log(
      "fetchOnboardingProgress API call - URL:",
      endpoints.onboarding.getProgress
    );
    const response = await api.get<OnboardingProgress>(
      endpoints.onboarding.getProgress
    );
    console.log("fetchOnboardingProgress API response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("fetchOnboardingProgress API error:", error);
    return rejectWithValue({
      message:
        error.response?.data?.message || "Failed to fetch onboarding progress",
      status: error.response?.status || 500,
      code: error.response?.data?.code,
    });
  }
});

/**
 * Async thunk to update step 2 (Innovation + Geography)
 */
export const updateStep2 = createAsyncThunk<
  OnboardingStepResponse,
  Step2Request,
  { rejectValue: OnboardingErrorResponse }
>("onboarding/updateStep2", async (step2Data, { rejectWithValue }) => {
  try {
    console.log(
      "updateStep2 API call - URL:",
      endpoints.onboarding.updateStep(2)
    );
    console.log("updateStep2 API call - Data:", step2Data);
    const response = await api.patch<OnboardingStepResponse>(
      endpoints.onboarding.updateStep(2),
      step2Data
    );
    console.log("updateStep2 API response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("updateStep2 API error:", error);
    return rejectWithValue({
      message: error.response?.data?.message || "Failed to update step 2",
      status: error.response?.status || 500,
      code: error.response?.data?.code,
    });
  }
});

/**
 * Async thunk to update step 3 (Sector + Stage + Budget)
 */
export const updateStep3 = createAsyncThunk<
  OnboardingStepResponse,
  Step3Request,
  { rejectValue: OnboardingErrorResponse }
>("onboarding/updateStep3", async (step3Data, { rejectWithValue }) => {
  try {
    console.log(
      "updateStep3 API call - URL:",
      endpoints.onboarding.updateStep(3)
    );
    console.log("updateStep3 API call - Data:", step3Data);
    const response = await api.patch<OnboardingStepResponse>(
      endpoints.onboarding.updateStep(3),
      step3Data
    );
    console.log("updateStep3 API response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("updateStep3 API error:", error);
    return rejectWithValue({
      message: error.response?.data?.message || "Failed to update step 3",
      status: error.response?.status || 500,
      code: error.response?.data?.code,
    });
  }
});

/**
 * Async thunk to finish onboarding
 */
export const finishOnboarding = createAsyncThunk<
  OnboardingFinishResponse,
  void,
  { rejectValue: OnboardingErrorResponse }
>("onboarding/finish", async (_, { rejectWithValue }) => {
  try {
    console.log(
      "finishOnboarding API call - URL:",
      endpoints.onboarding.finish
    );
    const response = await api.post<OnboardingFinishResponse>(
      endpoints.onboarding.finish
    );
    console.log("finishOnboarding API response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("finishOnboarding API error:", error);
    return rejectWithValue({
      message: error.response?.data?.message || "Failed to finish onboarding",
      status: error.response?.status || 500,
      code: error.response?.data?.code,
    });
  }
});

/**
 * Onboarding slice
 */
export const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    /**
     * Clear error message
     */
    clearError: (state) => {
      state.error = null;
    },

    /**
     * Reset onboarding state
     */
    resetOnboarding: (state) => {
      state.progress = null;
      state.isLoading = false;
      state.error = null;
      state.isFinishing = false;
    },

    /**
     * Set loading state
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    /**
     * Update progress data locally (for form pre-filling)
     */
    updateProgressData: (
      state,
      action: PayloadAction<Partial<OnboardingProgress["data"]>>
    ) => {
      if (state.progress) {
        state.progress.data = { ...state.progress.data, ...action.payload };
      }
    },

    // ✅ Store local Step 3 data (sector/stage/impact)
    setStep3Data: (
      state,
      action: PayloadAction<{ focusSector: string; stage: string; impactFocus: string; extra_info?: string }>
    ) => {
      if (!state.progress) state.progress = { current_step: 1, data: {}, is_complete: false };
      state.progress.data = { ...state.progress.data, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch progress
      .addCase(fetchOnboardingProgress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOnboardingProgress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.progress = action.payload;
        state.error = null;
      })
      .addCase(fetchOnboardingProgress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to fetch progress";
      })

      // Update step 2
      .addCase(updateStep2.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateStep2.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.progress) {
          state.progress.current_step = action.payload.current_step;
        }
        state.error = null;
      })
      .addCase(updateStep2.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to update step 2";
      })

      // Update step 3
      .addCase(updateStep3.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateStep3.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.progress) {
          state.progress.current_step = action.payload.current_step;
        }
        state.error = null;
      })
      .addCase(updateStep3.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to update step 3";
      })

      // Finish onboarding
      .addCase(finishOnboarding.pending, (state) => {
        state.isFinishing = true;
        state.error = null;
      })
      .addCase(finishOnboarding.fulfilled, (state) => {
        state.isFinishing = false;
        if (state.progress) {
          state.progress.is_complete = true;
        }
        state.error = null;
      })
      .addCase(finishOnboarding.rejected, (state, action) => {
        state.isFinishing = false;
        state.error = action.payload?.message || "Failed to finish onboarding";
      });
  },
});

// Export actions
export const { clearError, resetOnboarding, setLoading, updateProgressData, setStep3Data } =
  onboardingSlice.actions;

// Export reducer
export default onboardingSlice.reducer;
