/**
 * Banking SPO listing types
 * Represents the response structure returned by /api/bank/spos/
 */

export interface BankingSpoInstrument {
  id: number;
  name: string;
}

export interface BankingSpoScores {
  overall: number;
  sections: {
    IMPACT: number;
    RISK: number;
    RETURN: number;
  };
}

export interface BankingSpoEntry {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  date_joined: string;
  organization_name: string | null;
  focus_sector: string | null;
  org_created_at: string | null;
  last_assessment_submitted_at: string | null;
  last_loan_request_submitted_at: string | null;
  instrument: BankingSpoInstrument | null;
  scores: BankingSpoScores | null;
}

export interface BankingSpoPaginatedResponse {
  count: number;
  results: BankingSpoEntry[];
  next: string | null;
  previous: string | null;
}

export interface BankingSpoReportPayload {
  url: string;
  filename: string;
}

export interface BankingSpoDetailResponse {
  spo: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
    date_joined: string;
  };
  organization: {
    name: string | null;
    registration_type: string | null;
    cin: string | null;
    focus_sector: string | null;
    poc_email: string | null;
  };
  assessments: Array<{
    id: number;
    status: string;
    started_at: string;
    submitted_at: string;
    scores: {
      overall: number;
      sections: {
        RISK: number;
        IMPACT: number;
        RETURN: number;
        SECTOR_MATURITY?: number;
      };
    };
    eligibility_overall: number;
    eligibility_decision: boolean;
    eligibility_reason: string | null;
    loan_request_id: number | null;
  }>;
  email_placeholder?: string;
}

export interface BankingSpoState {
  items: BankingSpoEntry[];
  count: number;
  isLoading: boolean;
  error: string | null;
  lastFetchedAt: string | null;
  selected: BankingSpoEntry | null;
  isDetailLoading: boolean;
  detailError: string | null;
  isReportDownloading: boolean;
  reportError: string | null;
}

