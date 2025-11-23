/**
 * Admin SPO listing types
 * Represents the response structure returned by /api/admin/spos/
 */

export interface AdminSpoOrganization {
  id: number;
  name: string | null;
  registration_type: string | null;
  date_of_incorporation: string | null;
  gst_number: string | null;
  cin_number: string | null;
  type_of_innovation: string | null;
  geo_scope: string | null;
  top_states: string[];
  focus_sector: string | null;
  org_stage: string | null;
  impact_focus: string | null;
  annual_operating_budget: string | null;
  use_of_questionnaire: string | null;
  received_philanthropy_before: boolean | null;
}

export interface AdminSpoInstrument {
  id: number;
  name: string;
}

export interface AdminSpoScores {
  overall: number;
  sections: {
    IMPACT: number;
    RISK: number;
    RETURN: number;
  };
}

export interface AdminSpoEntry {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  is_active: boolean;
  date_joined: string;
  organization: AdminSpoOrganization | null;
  loan_eligible: boolean;
  instrument: AdminSpoInstrument | null;
  scores: AdminSpoScores | null;
  assessment_id: number | null;
}

export interface AssessmentQuestionResponse {
  code: string;
  text: string;
  type: 'SINGLE_CHOICE' | 'MULTI_CHOICE' | 'SLIDER' | 'MULTI_SLIDER' | 'RATING' | 'NPS' | 'VISUAL_RATING';
  answer?: {
    value?: string | number;
    values?: string[] | Record<string, number>;
  };
}

export interface AssessmentSection {
  code: string;
  name: string;
  questions: AssessmentQuestionResponse[];
}

export interface AssessmentResponsesData {
  assessment_id: number;
  status: string;
  started_at: string;
  submitted_at: string;
  sections: AssessmentSection[];
}

export interface AdminSpoState {
  items: AdminSpoEntry[];
  isLoading: boolean;
  error: string | null;
  lastFetchedAt: string | null;
  selected: AdminSpoEntry | null;
  isDetailLoading: boolean;
  detailError: string | null;
  isReportDownloading: boolean;
  reportError: string | null;
  isDeleting: boolean;
  deleteError: string | null;
  assessmentResponses: AssessmentResponsesData | null;
  isAssessmentResponsesLoading: boolean;
  assessmentResponsesError: string | null;
}

