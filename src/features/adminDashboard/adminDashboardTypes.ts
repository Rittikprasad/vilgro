/**
 * Admin dashboard summary types
 * Defines the response shape returned by /api/admin/dashboard/summary
 */

export interface DashboardSummaryWindow {
  from?: string;
  to?: string;
}

export interface DashboardSummaryKPI {
  total_spos: number;
  new_spos: number;
  completion_rate: number;
  loan_requests: number;
  window?: DashboardSummaryWindow;
}

export interface DashboardSummaryFunnel {
  counts: Record<string, number>;
  percents: Record<string, number>;
  denominators?: Record<string, number>;
}

export interface DashboardSummarySector {
  key: string;
  count: number;
}

export interface DashboardSummaryActivity {
  id: number;
  timestamp: string;
  actor: string | null;
  action: string;
  object: string;
  help_text: string;
}

export interface DashboardSummaryResponse {
  kpi: DashboardSummaryKPI;
  funnel?: DashboardSummaryFunnel;
  sector_distribution?: DashboardSummarySector[];
  recent_activity?: DashboardSummaryActivity[];
}

export interface AdminDashboardState {
  summary: DashboardSummaryResponse | null;
  isLoading: boolean;
  error: string | null;
  lastFetchedAt: string | null;
}

