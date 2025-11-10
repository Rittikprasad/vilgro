export interface AdminReviewUser {
  id?: number;
  name?: string;
  email?: string;
}

export interface AdminReviewEntry {
  id: number;
  created_at?: string;
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

export interface AdminReviewsState {
  items: AdminReviewEntry[];
  isLoading: boolean;
  error: string | null;
  lastFetchedAt: string | null;
}

