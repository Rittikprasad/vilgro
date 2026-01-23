import { createAsyncThunk } from "@reduxjs/toolkit";
import type {
  LoginRequest,
  LoginResponse,
  UserProfileResponse,
  OnboardingProgressResponse,
  ThunkApiConfig,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  VerifyCodeRequest,
  VerifyCodeResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
} from "./authTypes";
import { authSlice } from "./authSlice";
import { resetOnboarding } from "../onboarding/onboardingSlice";
import api from "../../services/api";
import { endpoints } from "../../services/endpoints";
import { ApiResponseHandler } from "../../lib/apiResponseHandler";

/**
 * Helper function to logout user and reset onboarding
 * Ensures both auth and onboarding state are cleared
 */
const logoutAndResetOnboarding = (dispatch: any) => {
  dispatch(authSlice.actions.logout());
  dispatch(resetOnboarding());
};


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
    // Reset loading state on error
    dispatch(authSlice.actions.setLoading(false));

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
        logoutAndResetOnboarding(dispatch);
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
    logoutAndResetOnboarding(dispatch);

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
        logoutAndResetOnboarding(dispatch);
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
      logoutAndResetOnboarding(dispatch);
    }
  }
);

/**
 * Forgot password async thunk
 * Sends password reset code to user's email
 */
export const forgotPassword = createAsyncThunk<
  ForgotPasswordResponse,
  ForgotPasswordRequest,
  ThunkApiConfig
>("auth/forgotPassword", async (request, { rejectWithValue, dispatch }) => {
  try {
    dispatch(authSlice.actions.setLoading(true));
    dispatch(authSlice.actions.clearError());

    const response = await api.post<ForgotPasswordResponse>(
      endpoints.auth.forgotPassword,
      { email: request.email }
    );

    // Store email in state for next steps
    dispatch(authSlice.actions.setForgotPasswordEmail(request.email));

    ApiResponseHandler.handleSuccess({
      message: response.data.message || "Password reset code sent to your email",
    });

    dispatch(authSlice.actions.setLoading(false));
    return response.data;
  } catch (error: any) {
    dispatch(authSlice.actions.setLoading(false));

    const errorMessage =
      error.response?.data?.message || error.response?.data?.detail || "Failed to send reset code";
    ApiResponseHandler.handleError(error, "Failed to send reset code");

    dispatch(authSlice.actions.setError(errorMessage));
    return rejectWithValue({
      message: errorMessage,
      status: error.response?.status || 500,
      code: error.response?.data?.code,
    });
  }
});

/**
 * Verify code async thunk
 * Verifies the password reset code sent to user's email
 */
export const verifyCode = createAsyncThunk<
  VerifyCodeResponse,
  VerifyCodeRequest,
  ThunkApiConfig
>("auth/verifyCode", async (request, { rejectWithValue, dispatch }) => {
  try {
    dispatch(authSlice.actions.setLoading(true));
    dispatch(authSlice.actions.clearError());

    const response = await api.post<VerifyCodeResponse>(
      endpoints.auth.verifyCode,
      {
        email: request.email,
        code: request.code,
      }
    );

    // Store the code for the next step (reset password)
    dispatch(authSlice.actions.setResetCode(request.code));

    // Store token if provided by API
    if (response.data.token) {
      dispatch(authSlice.actions.setResetToken(response.data.token));
    }

    ApiResponseHandler.handleSuccess({
      message: response.data.message || "Code verified successfully",
    });

    dispatch(authSlice.actions.setLoading(false));
    return response.data;
  } catch (error: any) {
    dispatch(authSlice.actions.setLoading(false));

    const errorMessage =
      error.response?.data?.message || error.response?.data?.detail || "Invalid verification code";
    ApiResponseHandler.handleError(error, "Code verification failed");

    dispatch(authSlice.actions.setError(errorMessage));
    return rejectWithValue({
      message: errorMessage,
      status: error.response?.status || 500,
      code: error.response?.data?.code,
    });
  }
});

/**
 * Reset password async thunk
 * Resets user password with new password
 */
export const resetPassword = createAsyncThunk<
  ResetPasswordResponse,
  ResetPasswordRequest,
  ThunkApiConfig
>("auth/resetPassword", async (request, { rejectWithValue, dispatch, getState }) => {
  try {
    dispatch(authSlice.actions.setLoading(true));
    dispatch(authSlice.actions.clearError());

    const state = getState();
    const resetToken = state.auth.resetToken;
    const resetCode = state.auth.resetCode;

    const payload: any = {
      email: request.email,
      new_password: request.newPassword,
      confirm_password: request.confirmPassword,
      code: resetCode,
    };

    // Include token if available
    if (resetToken) {
      payload.token = resetToken;
    }

    const response = await api.post<ResetPasswordResponse>(
      endpoints.auth.resetPassword,
      payload
    );

    // Clear forgot password data after successful reset
    dispatch(authSlice.actions.clearForgotPasswordData());

    ApiResponseHandler.handleSuccess({
      message: response.data.message || "Password reset successfully",
    });

    dispatch(authSlice.actions.setLoading(false));
    return response.data;
  } catch (error: any) {
    dispatch(authSlice.actions.setLoading(false));

    const errorMessage =
      error.response?.data?.message || error.response?.data?.detail || "Failed to reset password";
    ApiResponseHandler.handleError(error, "Password reset failed");

    dispatch(authSlice.actions.setError(errorMessage));
    return rejectWithValue({
      message: errorMessage,
      status: error.response?.status || 500,
      code: error.response?.data?.code,
    });
  }
});

/**
 * Change password async thunk
 * Changes user password when authenticated
 */
export const changePassword = createAsyncThunk<
  ChangePasswordResponse,
  ChangePasswordRequest,
  ThunkApiConfig
>("auth/changePassword", async (request, { rejectWithValue, dispatch }) => {
  try {
    dispatch(authSlice.actions.setLoading(true));
    dispatch(authSlice.actions.clearError());

    const response = await api.post<ChangePasswordResponse>(
      endpoints.auth.changePassword,
      {
        current_password: request.current_password,
        new_password: request.new_password,
        confirm_password: request.confirm_password,
      }
    );

    ApiResponseHandler.handleSuccess({
      message: response.data.message || "Password changed successfully",
    });

    dispatch(authSlice.actions.setLoading(false));
    return response.data;
  } catch (error: any) {
    dispatch(authSlice.actions.setLoading(false));

    const errorMessage =
      error.response?.data?.message || error.response?.data?.detail || "Failed to change password";
    ApiResponseHandler.handleError(error, "Password change failed");

    dispatch(authSlice.actions.setError(errorMessage));
    return rejectWithValue({
      message: errorMessage,
      status: error.response?.status || 500,
      code: error.response?.data?.code,
    });
  }
});
