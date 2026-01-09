import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, User, LoginResponse } from "./authTypes";

/**
 * Helper function to get stored user data from localStorage
 */
const getStoredUserData = () => {
  try {
    const storedUser = localStorage.getItem("user");
    const storedProfileStatus = localStorage.getItem("has_completed_profile");
    const storedOnboarding = localStorage.getItem("onboarding");

    return {
      user: storedUser ? JSON.parse(storedUser) : null,
      has_completed_profile: storedProfileStatus
        ? JSON.parse(storedProfileStatus)
        : false,
      onboarding: storedOnboarding ? JSON.parse(storedOnboarding) : null,
    };
  } catch (error) {
    console.warn("Error parsing stored user data:", error);
    return {
      user: null,
      has_completed_profile: false,
      onboarding: null,
    };
  }
};

/**
 * Initial authentication state
 * Defines the default state when the app starts
 */
const storedData = getStoredUserData();
// Get forgot password data from sessionStorage (cleared on browser close)
const getForgotPasswordData = () => {
  try {
    return {
      email: sessionStorage.getItem("forgotPasswordEmail"),
      token: sessionStorage.getItem("resetToken"),
    };
  } catch (error) {
    return { email: null, token: null };
  }
};

const forgotPasswordData = getForgotPasswordData();
const initialState: AuthState = {
  user: storedData.user,
  accessToken: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),
  isAuthenticated: !!localStorage.getItem("accessToken"), // Set to true if token exists
  isLoading: false,
  error: null,
  has_completed_profile: storedData.has_completed_profile,
  onboarding: storedData.onboarding,
  forgotPasswordEmail: forgotPasswordData.email,
  resetToken: forgotPasswordData.token,
};

/**
 * Authentication slice using Redux Toolkit
 * Manages authentication state and provides reducers for state updates
 */
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /**
     * Sets authentication tokens
     * Updates access and refresh tokens in state and localStorage
     */
    setTokens: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;

      // Persist tokens to localStorage
      localStorage.setItem("accessToken", action.payload.accessToken);
      localStorage.setItem("refreshToken", action.payload.refreshToken);
    },

    /**
     * Sets user information
     * Updates the current user data in state and localStorage
     */
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;

      // Persist user data to localStorage
      localStorage.setItem("user", JSON.stringify(action.payload));
    },

    /**
     * Sets loading state
     * Updates the loading indicator for async operations
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    /**
     * Sets error message
     * Updates the error state with a specific error message
     */
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    /**
     * Clears error message
     * Removes any existing error from state
     */
    clearError: (state) => {
      state.error = null;
    },

    /**
     * Logs out the user
     * Clears all authentication data and resets state
     */
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      state.has_completed_profile = false;
      state.onboarding = null;

      // Clear all auth data from localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      localStorage.removeItem("has_completed_profile");
      localStorage.removeItem("onboarding");
    },

    /**
     * Sets complete authentication data
     * Updates all auth data from login response
     */
    setAuthData: (state, action: PayloadAction<LoginResponse>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.access;
      state.refreshToken = action.payload.refresh;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
      state.has_completed_profile =
        action.payload.has_completed_profile || false;
      state.onboarding = action.payload.onboarding || null;

      // Persist all auth data to localStorage
      localStorage.setItem("accessToken", action.payload.access);
      localStorage.setItem("refreshToken", action.payload.refresh);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem(
        "has_completed_profile",
        JSON.stringify(action.payload.has_completed_profile || false)
      );
      if (action.payload.onboarding) {
        localStorage.setItem(
          "onboarding",
          JSON.stringify(action.payload.onboarding)
        );
      }
    },

    /**
     * Updates only the access token
     * Used when refreshing tokens
     */
    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      localStorage.setItem("accessToken", action.payload);
    },

    /**
     * Updates onboarding progress
     * Updates the current onboarding step and completion status
     */
    updateOnboarding: (
      state,
      action: PayloadAction<{ current_step: number; is_complete: boolean }>
    ) => {
      state.onboarding = action.payload;
      localStorage.setItem("onboarding", JSON.stringify(action.payload));
    },

    /**
     * Updates profile completion status
     * Updates whether the user has completed their profile
     */
    updateProfileCompletion: (state, action: PayloadAction<boolean>) => {
      state.has_completed_profile = action.payload;
      localStorage.setItem(
        "has_completed_profile",
        JSON.stringify(action.payload)
      );
    },

    /**
     * Sets forgot password email
     * Stores email during forgot password flow
     */
    setForgotPasswordEmail: (state, action: PayloadAction<string>) => {
      state.forgotPasswordEmail = action.payload;
      sessionStorage.setItem("forgotPasswordEmail", action.payload);
    },

    /**
     * Sets reset token
     * Stores token from verify code step for password reset
     */
    setResetToken: (state, action: PayloadAction<string>) => {
      state.resetToken = action.payload;
      sessionStorage.setItem("resetToken", action.payload);
    },

    /**
     * Clears forgot password data
     * Clears email and token after password reset is complete
     */
    clearForgotPasswordData: (state) => {
      state.forgotPasswordEmail = null;
      state.resetToken = null;
      sessionStorage.removeItem("forgotPasswordEmail");
      sessionStorage.removeItem("resetToken");
    },
  },
});

// Export action creators
export const {
  setTokens,
  setUser,
  setLoading,
  setError,
  clearError,
  logout,
  setAuthData,
  updateAccessToken,
  updateOnboarding,
  updateProfileCompletion,
  setForgotPasswordEmail,
  setResetToken,
  clearForgotPasswordData,
} = authSlice.actions;

// Export reducer
export default authSlice.reducer;
