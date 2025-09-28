/**
 * Authentication types and interfaces
 * Defines all TypeScript types for authentication functionality
 */

// User interface representing the authenticated user
export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// Authentication state interface
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Login request payload
export interface LoginRequest {
  email: string;
  password: string;
}

// Login response from API
export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// Refresh token request payload
export interface RefreshTokenRequest {
  refreshToken: string;
}

// Refresh token response from API
export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// User profile response
export interface UserProfileResponse {
  user: User;
}

// API error response
export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// Thunk API types for createAsyncThunk
export interface ThunkApiConfig {
  rejectValue: ApiError;
  state: {
    auth: AuthState;
  };
}
