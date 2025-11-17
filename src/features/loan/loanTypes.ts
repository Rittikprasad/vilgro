/**
 * Loan feature types
 * Defines TypeScript interfaces for loan-related data structures
 */

export interface FundType {
  value: string;
  label: string;
}

export interface LoanMetaResponse {
  fund_types: FundType[];
}

export interface OrganizationDetails {
  name: string | null;
  date_of_incorporation: string | null;
  dpiit_number: string | null;
  legal_registration_type: string | null;
  cin_number: string | null;
  poc_email: string | null;
  focus_area: string | null;
  company_type: string | null;
  annual_operating_budget: string | null;
  geo_scope: string | null;
}

export interface AssessmentScores {
  overall: number;
  sections: {
    RISK: number;
    IMPACT: number;
    RETURN: number;
    SECTOR_MATURITY: number;
  };
}

export interface LoanPrefillResponse {
  assessment_id: number;
  organization: OrganizationDetails;
  assessment_scores: AssessmentScores;
}

export interface LoanSubmitRequest {
  assessment: number;
  founder_name: string;
  founder_email: string;
  amount_in_inr: string;
  fund_type: string;
}

export interface LoanSubmitResponse {
  message?: string;
  id?: number;
}

export interface LoanState {
  fundTypes: FundType[];
  prefillData: LoanPrefillResponse | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  submitError: string | null;
}

