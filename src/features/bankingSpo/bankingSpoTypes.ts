/**
 * Banking SPO listing types
 * Represents the response structure returned by /api/bank/spos/
 */

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

