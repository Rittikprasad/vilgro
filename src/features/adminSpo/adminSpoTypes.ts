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
}

