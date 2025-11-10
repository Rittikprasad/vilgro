export interface AdminDetailsEntry {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  date_joined: string;
  phone?: string | null;
}

export interface AdminDetailsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AdminDetailsEntry[];
}

export interface AdminDetailsPayload {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  password?: string;
}

export interface FetchAdminDetailsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  ordering?: string;
}

export interface AdminDetailsState {
  items: AdminDetailsEntry[];
  count: number;
  next: string | null;
  previous: string | null;
  isLoading: boolean;
  error: string | null;
  lastFetchedAt: string | null;
  currentPage: number;
  pageSize: number;
  searchTerm: string;
  ordering: string | null;
  isCreating: boolean;
  createError: string | null;
  isUpdating: boolean;
  updateError: string | null;
}

