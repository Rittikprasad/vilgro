import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User, LoginResponse } from './authTypes';

/**
 * Initial authentication state
 * Defines the default state when the app starts
 */
const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

/**
 * Authentication slice using Redux Toolkit
 * Manages authentication state and provides reducers for state updates
 */
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Sets authentication tokens
     * Updates access and refresh tokens in state and localStorage
     */
    setTokens: (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      
      // Persist tokens to localStorage
      localStorage.setItem('accessToken', action.payload.accessToken);
      localStorage.setItem('refreshToken', action.payload.refreshToken);
    },

    /**
     * Sets user information
     * Updates the current user data in state
     */
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
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
      
      // Clear tokens from localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },

    /**
     * Sets complete authentication data
     * Updates all auth data from login response
     */
    setAuthData: (state, action: PayloadAction<LoginResponse>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
      
      // Persist tokens to localStorage
      localStorage.setItem('accessToken', action.payload.accessToken);
      localStorage.setItem('refreshToken', action.payload.refreshToken);
    },

    /**
     * Updates only the access token
     * Used when refreshing tokens
     */
    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      localStorage.setItem('accessToken', action.payload);
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
} = authSlice.actions;

// Export reducer
export default authSlice.reducer;
