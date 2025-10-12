import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "../../services/api";
import { endpoints } from "../../services/endpoints";
import { ApiResponseHandler } from "../../lib/apiResponseHandler";
import type {
  SignupState,
  SignupStartRequest,
  SignupStartResponse,
  SignupCompleteRequest,
  SignupCompleteResponse,
  SignupErrorResponse,
} from "./signupTypes";

/**
 * Initial signup state
 */
const initialState: SignupState = {
  isLoading: false,
  error: null,
  step1Completed: false,
  step1bCompleted: false,
  currentUser: null,
  tokens: null,
};

/**
 * Async thunk for starting SPO signup (Step 1)
 */
export const startSignup = createAsyncThunk<
  SignupStartResponse,
  SignupStartRequest,
  { rejectValue: SignupErrorResponse }
>("signup/startSignup", async (signupData, { rejectWithValue }) => {
  try {
    const response = await api.post<SignupStartResponse>(
      endpoints.auth.spoSignupStart,
      signupData
    );

    // Store tokens in localStorage
    localStorage.setItem("accessToken", response.data.tokens.access);
    localStorage.setItem("refreshToken", response.data.tokens.refresh);

    // Show success notification with API message
    ApiResponseHandler.handleSuccess({ message: response.data.message || "Account created successfully!" });

    return response.data;
  } catch (error: any) {
    // Handle error with centralized error handler
    ApiResponseHandler.handleError(error, "Signup failed");
    
    // Return the actual error response data to preserve field-specific errors
    const errorData = error.response?.data || {};
    return rejectWithValue({
      ...errorData,
      message: errorData.message || "Signup failed",
      status: error.response?.status || 500,
      code: errorData.code,
    });
  }
});

/**
 * Async thunk for completing legal basics (Step 1b)
 */
export const completeSignup = createAsyncThunk<
  SignupCompleteResponse,
  SignupCompleteRequest,
  { rejectValue: SignupErrorResponse }
>("signup/completeSignup", async (completeData, { rejectWithValue }) => {
  try {
    const response = await api.post<SignupCompleteResponse>(
      endpoints.auth.spoSignupComplete,
      completeData
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue({
      message: error.response?.data?.message || "Failed to complete signup",
      status: error.response?.status || 500,
      code: error.response?.data?.code,
    });
  }
});

/**
 * Signup slice
 */
export const signupSlice = createSlice({
  name: "signup",
  initialState,
  reducers: {
    /**
     * Clear error message
     */
    clearError: (state) => {
      state.error = null;
    },

    /**
     * Reset signup state
     */
    resetSignup: (state) => {
      state.isLoading = false;
      state.error = null;
      state.step1Completed = false;
      state.step1bCompleted = false;
      state.currentUser = null;
      state.tokens = null;
    },

    /**
     * Set loading state
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Start signup
      .addCase(startSignup.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(startSignup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.step1Completed = true;
        state.currentUser = action.payload.user;
        state.tokens = action.payload.tokens;
        state.error = null;
      })
      .addCase(startSignup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Signup failed";
      })

      // Complete signup
      .addCase(completeSignup.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(completeSignup.fulfilled, (state) => {
        state.isLoading = false;
        state.step1bCompleted = true;
        state.error = null;
      })
      .addCase(completeSignup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to complete signup";
      });
  },
});

// Export actions
export const { clearError, resetSignup, setLoading } = signupSlice.actions;

// Export reducer
export default signupSlice.reducer;
