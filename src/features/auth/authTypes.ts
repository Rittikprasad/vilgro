/**
 * Authentication types and interfaces
 * Defines all TypeScript types for authentication functionality
 */

// User interface representing the authenticated user
export interface Organization {
  name: string;
  registration_type: string;
  date_of_incorporation: string;
  gst_number: string;
  cin_number: string;
  org_desc?: string;
}

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
  phone?: string;
  organization?: Organization;
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
  forgotPasswordEmail: string | null;
  resetToken: string | null;
  resetCode: string | null;
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
  organization?: Organization;
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

// Forgot password request
export interface ForgotPasswordRequest {
  email: string;
}

// Forgot password response
export interface ForgotPasswordResponse {
  message?: string;
}

// Verify code request
export interface VerifyCodeRequest {
  email: string;
  code: string;
}

// Verify code response
export interface VerifyCodeResponse {
  message?: string;
  token?: string; // Some APIs return a token for password reset
}

// Reset password request
export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
  confirmPassword?: string;
  token?: string; // If API requires token from verify code step
}

// Reset password response
export interface ResetPasswordResponse {
  message?: string;
}

// Change password request
export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

// Change password response
export interface ChangePasswordResponse {
  message?: string;
}

// Thunk API types for createAsyncThunk
export interface ThunkApiConfig {
  rejectValue: ApiError;
  state: {
    auth: AuthState;
  };
}
