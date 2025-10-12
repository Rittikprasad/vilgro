/**
 * Authentication types and interfaces
 * Defines all TypeScript types for authentication functionality
 */

// User interface representing the authenticated user
export interface User {
  id?: string;
  email: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  role: string;
  avatar?: string;
  has_completed_profile?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Authentication state interface
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  has_completed_profile: boolean;
  onboarding: {
    current_step: number;
    is_complete: boolean;
  } | null;
}

// Login request payload
export interface LoginRequest {
  email: string;
  password: string;
}

// Login response from API
export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
  has_completed_profile?: boolean;
  onboarding?: {
    current_step: number;
    is_complete: boolean;
  };
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

// Onboarding progress response
export interface OnboardingProgressResponse {
  current_step: number;
  is_complete: boolean;
  draft_data?: Record<string, any>;
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
