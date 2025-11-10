export interface AdminActivityLogMeta {
  body?: string;
  path: string;
  query: string;
  method: string;
  status: number;
  [key: string]: unknown;
}

export interface AdminActivityLogEntry {
  id: number;
  created_at: string;
  actor: number | null;
  actor_email: string | null;
  action: string;
  app_label: string;
  model: string;
  object_id: string;
  object_repr: string;
  changes: Record<string, unknown>;
  meta: AdminActivityLogMeta;
  help_text: string;
}

export interface AdminActivityLogResponse {
  count: number;
  page: number;
  page_size: number;
  results: AdminActivityLogEntry[];
}

export interface FetchAdminActivityLogParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface AdminActivityLogState {
  items: AdminActivityLogEntry[];
  count: number;
  currentPage: number;
  pageSize: number;
  isLoading: boolean;
  error: string | null;
  lastFetchedAt: string | null;
}

