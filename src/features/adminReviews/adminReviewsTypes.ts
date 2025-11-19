export interface AdminReviewUser {
  id?: number;
  name?: string;
  email?: string;
}

export interface AdminReviewEntry {
  id: number;
  assessment_id?: number;
  date?: string;
  created_at?: string;
  user_id?: number;
  user_email?: string;
  status?: string;
  review?: string;
  organization_name?: string;
  organization?: {
    name?: string;
  };
  user_name?: string;
  user?: AdminReviewUser;
  [key: string]: unknown;
}

export interface AdminReviewsPaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AdminReviewEntry[];
}

export interface AdminReviewsState {
  items: AdminReviewEntry[];
  isLoading: boolean;
  error: string | null;
  lastFetchedAt: string | null;
}

