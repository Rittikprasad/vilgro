/**
 * Type definitions for signup flow
 * Defines the structure of signup data and API responses
 */

export interface SignupStartRequest {
  email: string;
  password: string;
  confirm_password: string;
  agree_to_terms: boolean;
}

export interface SignupStartResponse {
  message: string;
  user: {
    email: string;
    role: string;
  };
  tokens: {
    access: string;
    refresh: string;
  };
}

export interface SignupCompleteRequest {
  org_name: string;
  registration_type?: string; // Made optional
  date_of_incorporation: string; // Made mandatory
  gst_number?: string;
  cin_number?: string;
}

export interface SignupCompleteResponse {
  message: string;
  organization: {
    name: string;
    registration_type: string;
  };
}

export interface SignupState {
  isLoading: boolean;
  error: string | null;
  fieldErrors: Record<string, string[]> | null;
  step1Completed: boolean;
  step1bCompleted: boolean;
  currentUser: SignupStartResponse["user"] | null;
  tokens: SignupStartResponse["tokens"] | null;
}

export interface SignupErrorResponse {
  message: string;
  status: number;
  code?: string;
  errors?: Record<string, string[]>;
}
