/**
 * Type definitions for onboarding flow
 * Defines the structure of onboarding data and API responses
 */

export interface OnboardingProgress {
  current_step: number;
  data: {
    step2?: Step2Data;
    step3?: Step3Data;
    // ✅ Support for Step 3 local data
    focusSector?: string;
    stage?: string;
    impactFocus?: string;
    extra_info?: string;
  };
  is_complete: boolean;
}

export interface Step2Data {
  type_of_innovation: string;
  geo_scope: string;
  top_states: string[];
}

export interface Step3Data {
  focus_sector: string;
  org_stage: string;
  impact_focus: string;
  annual_operating_budget: string;
  use_of_questionnaire: string;
  received_philanthropy_before: boolean;
  extra_info?: string;
  org_desc?: string;
}

export interface Step2Request {
  type_of_innovation: string;
  geo_scope: string;
  top_states: string[];
}

export interface Step3Request {
  focus_sector: string;
  org_stage: string;
  impact_focus: string;
  annual_operating_budget: string;
  use_of_questionnaire: string;
  received_philanthropy_before: boolean;
  extra_info?: string;
  org_desc?: string;
}

export interface OnboardingStepResponse {
  message: string;
  current_step: number;
}

export interface OnboardingFinishResponse {
  message: string;
  onboarding: {
    is_complete: boolean;
  };
}

export interface OnboardingState {
  progress: OnboardingProgress | null;
  isLoading: boolean;
  error: string | null;
  isFinishing: boolean;
}

export interface OnboardingErrorResponse {
  message: string;
  status: number;
  code?: string;
}
