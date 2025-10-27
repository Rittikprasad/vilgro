import { createAsyncThunk } from "@reduxjs/toolkit";
import type {
  LoginRequest,
  LoginResponse,
  UserProfileResponse,
  OnboardingProgressResponse,
  ThunkApiConfig,
} from "./authTypes";
import { authSlice } from "./authSlice";
import api from "../../services/api";
import { endpoints } from "../../services/endpoints";
import { ApiResponseHandler } from "../../lib/apiResponseHandler";


export const login = createAsyncThunk<
  LoginResponse,
  LoginRequest,
  ThunkApiConfig
>("auth/login", async (credentials, { rejectWithValue, dispatch }) => {
  try {
    // Set loading state
    dispatch(authSlice.actions.setLoading(true));
    dispatch(authSlice.actions.clearError());

    // Make login API call
    const response = await api.post<LoginResponse>(
      endpoints.auth.login,
      credentials
    );

    // Show success notification
    ApiResponseHandler.handleSuccess({ message: "Login successful!" });

    // Dispatch success actions
    dispatch(authSlice.actions.setAuthData(response.data));

    return response.data;
  } catch (error: any) {
    // Handle error with centralized error handler
    ApiResponseHandler.handleError(error, "Login failed");
    
    const errorMessage = error.response?.data?.message || "Login failed";
    dispatch(authSlice.actions.setError(errorMessage));
    return rejectWithValue({
      message: errorMessage,
      status: error.response?.status || 500,
      code: error.response?.data?.code,
    });
  }
});


export const fetchUserProfile = createAsyncThunk<
  UserProfileResponse,
  void,
  ThunkApiConfig
>(
  "auth/fetchUserProfile",
  async (_, { rejectWithValue, dispatch, getState }) => {
    try {
      // Check if user is authenticated
      const state = getState();
      if (!state.auth.accessToken) {
        throw new Error("No access token available");
      }

      // Set loading state
      dispatch(authSlice.actions.setLoading(true));
      dispatch(authSlice.actions.clearError());

      // Make API call to fetch user profile
      const response = await api.get<UserProfileResponse>(
        endpoints.auth.profile
      );

      // Update user data
      dispatch(authSlice.actions.setUser(response.data.user));
      dispatch(authSlice.actions.setLoading(false));

      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch user profile";
      
      // Handle 404 errors gracefully - user might not have a profile yet
      if (error.response?.status === 404) {
        console.warn('User profile not found (404) - user may not have completed profile setup');
        dispatch(authSlice.actions.setLoading(false));
        return rejectWithValue({
          message: "Profile not found - user needs to complete profile setup",
          status: 404,
          code: "PROFILE_NOT_FOUND",
        });
      }

      dispatch(authSlice.actions.setError(errorMessage));
      dispatch(authSlice.actions.setLoading(false));

      // If token is invalid, logout user
      if (error.response?.status === 401) {
        dispatch(authSlice.actions.logout());
      }

      return rejectWithValue({
        message: errorMessage,
        status: error.response?.status || 500,
        code: error.response?.data?.code,
      });
    }
  }
);


export const refreshToken = createAsyncThunk<
  { accessToken: string; refreshToken: string },
  void,
  ThunkApiConfig
>("auth/refreshToken", async (_, { rejectWithValue, dispatch, getState }) => {
  try {
    const state = getState();
    const refreshTokenValue = state.auth.refreshToken;

    if (!refreshTokenValue) {
      throw new Error("No refresh token available");
    }

    // Make API call to refresh token
    const response = await api.post(endpoints.auth.refresh, {
      refresh: refreshTokenValue,
    });

    // API returns { access, refresh }, not { accessToken, refreshToken }
    const newAccessToken = response.data.access;
    const newRefreshToken = response.data.refresh;

    // Update tokens in Redux store
    dispatch(
      authSlice.actions.setTokens({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      })
    );

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  } catch (error: any) {
    // If refresh fails, logout user
    dispatch(authSlice.actions.logout());

    return rejectWithValue({
      message: "Token refresh failed",
      status: error.response?.status || 500,
      code: error.response?.data?.code,
    });
  }
});

/**
 * Fetch onboarding progress async thunk
 * Retrieves current onboarding progress and draft data
 */
export const fetchOnboardingProgress = createAsyncThunk<
  OnboardingProgressResponse,
  void,
  ThunkApiConfig
>(
  "auth/fetchOnboardingProgress",
  async (_, { rejectWithValue, dispatch, getState }) => {
    try {
      // Check if user is authenticated
      const state = getState();
      if (!state.auth.accessToken) {
        throw new Error("No access token available");
      }

      // Set loading state
      dispatch(authSlice.actions.setLoading(true));
      dispatch(authSlice.actions.clearError());

      // Make API call to fetch onboarding progress
      const response = await api.get<OnboardingProgressResponse>(
        endpoints.onboarding.getProgress
      );

      // Update onboarding data in auth state
      dispatch(
        authSlice.actions.updateOnboarding({
          current_step: response.data.current_step,
          is_complete: response.data.is_complete,
        })
      );

      dispatch(authSlice.actions.setLoading(false));

      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch onboarding progress";
      dispatch(authSlice.actions.setError(errorMessage));
      dispatch(authSlice.actions.setLoading(false));

      // If token is invalid, logout user
      if (error.response?.status === 401) {
        dispatch(authSlice.actions.logout());
      }

      return rejectWithValue({
        message: errorMessage,
        status: error.response?.status || 500,
        code: error.response?.data?.code,
      });
    }
  }
);

/**
 * Logout async thunk
 * Handles user logout and token cleanup
 */
export const logoutUser = createAsyncThunk<void, void, ThunkApiConfig>(
  "auth/logoutUser",
  async (_, { dispatch, getState }) => {
    try {
      // Get refresh token for logout request
      const state = getState();
      const refreshToken = state.auth.refreshToken;

      // Call logout endpoint with refresh token
      if (refreshToken) {
        await api.post(endpoints.auth.logout, { refresh: refreshToken });
        console.log("Logout API call successful");
      } else {
        console.warn("No refresh token available for logout");
      }
    } catch (error) {
      // Ignore logout API errors, still clear local state
      console.warn("Logout API call failed:", error);
    } finally {
      // Always clear local state and localStorage
      dispatch(authSlice.actions.logout());
    }
  }
);
