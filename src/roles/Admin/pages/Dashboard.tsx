import React, { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import LayoutWrapper from "../layout/LayoutWrapper";
import DashboardHeader from "./Dashboard/DashboardHeader";
import StatsCards from "./Dashboard/StatsCards";
import AssessmentFunnel from "./Dashboard/AssessmentFunnel";
import SectorDistribution from "./Dashboard/SectorDistribution";
import RecentActivity from "./Dashboard/RecentActivity";
import type { AppDispatch, RootState } from "../../../app/store";
import { fetchAdminDashboardSummary } from "../../../features/adminDashboard/adminDashboardSlice";

const sectorColorMap: Record<string, string> = {
  AGRICULTURE: "#FFC107",
  HEALTH: "#FF7043",
  WASTE: "#66B2FF",
  LIVELIHOOD: "#9C27B0",
  OTHERS: "#4CAF50",
};

const fallbackColors = ["#46B753", "#E0DC32", "#10B981", "#3B82F6", "#F97316", "#8B5CF6"];

const formatNumber = (value?: number) => {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return "0";
  }
  return new Intl.NumberFormat().format(value);
};

const formatPercentage = (value?: number, fractionDigits = 0) => {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return "0%";
  }
  return `${Number.parseFloat(value.toFixed(fractionDigits))}%`;
};

const formatSectorName = (key: string) => {
  return key
    .toLowerCase()
    .split(/[_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatRelativeTime = (timestamp: string) => {
  const targetDate = new Date(timestamp);
  if (Number.isNaN(targetDate.getTime())) {
    return "";
  }

  const diffMs = Date.now() - targetDate.getTime();
  if (diffMs < 0) {
    return "Just now";
  }

  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 60) return "Just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} ${days === 1 ? "day" : "days"} ago`;

  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} ${months === 1 ? "month" : "months"} ago`;

  const years = Math.floor(days / 365);
  return `${years} ${years === 1 ? "year" : "years"} ago`;
};

const formatDateRange = (from?: string, to?: string) => {
  if (!from || !to) {
    return "last 7 days";
  }
  const formatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
  const fromDate = new Date(from);
  const toDate = new Date(to);

  if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime())) {
    return "last 7 days";
  }

  return `${formatter.format(fromDate)} - ${formatter.format(toDate)}`;
};

/**
 * Admin Dashboard Component
 * Main dashboard view for admin users
 * 
 * NOTE: Currently accessible without authentication for development
 * TODO: API Integration
 * - Add role-based authentication check
 * - Fetch and display admin-specific data
 * - Add admin features (user management, analytics, etc.)
 */
const AdminDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const { summary, isLoading, error } = useSelector(
    (state: RootState) => state.adminDashboard
  );
  const [dashboardFilters, setDashboardFilters] = React.useState<{ start_date?: string; end_date?: string }>({});
  const [hasInitialFetch, setHasInitialFetch] = React.useState(false);

  const fetchSummary = useCallback((filters?: { start_date?: string; end_date?: string }) => {
    void dispatch(fetchAdminDashboardSummary(filters || undefined));
  }, [dispatch]);

  // Initial fetch without filters
  useEffect(() => {
    if (!hasInitialFetch) {
      fetchSummary();
      setHasInitialFetch(true);
    }
  }, [fetchSummary, hasInitialFetch]);

  // Refetch when filters change
  useEffect(() => {
    if (hasInitialFetch) {
      fetchSummary(dashboardFilters);
    }
  }, [dashboardFilters.start_date, dashboardFilters.end_date, hasInitialFetch, fetchSummary]);

  const handleFilterChange = useCallback((filters: { start_date?: string; end_date?: string }) => {
    setDashboardFilters(filters);
  }, []);

  const statsData = useMemo(() => {
    if (!summary) {
      return [
        { title: "Total SPOs registered", value: "0" },
        { title: "New SPOs", value: "0" },
        { title: "Completion Rate", value: "0%" },
        { title: "Loan Request Submission", value: "0" },
      ];
    }

    return [
      { title: "Total SPOs registered", value: formatNumber(summary.kpi.total_spos) },
      { title: "New SPOs", value: formatNumber(summary.kpi.new_spos) },
      { title: "Completion Rate", value: formatPercentage(summary.kpi.completion_rate) },
      { title: "Loan Request Submission", value: formatNumber(summary.kpi.loan_requests) },
    ];
  }, [summary]);

  const funnelData = useMemo(() => {
    if (!summary?.funnel) {
      return [];
    }

    const steps: Array<{ key: keyof typeof summary.funnel.counts; label: string }> = [
      { key: "registered", label: "Registered" },
      { key: "completed_basic_info", label: "Completed Basic Information" },
      { key: "completed_impact", label: "Completed Impact" },
      { key: "completed_risk", label: "Completed Risk" },
      { key: "completed_return", label: "Completed Return" },
    ];

    return steps.map((step) => ({
      label: step.label,
      count: summary.funnel?.counts?.[step.key] ?? 0,
      percentage: Number(
        (summary.funnel?.percents?.[step.key] ?? 0).toFixed(2)
      ),
    }));
  }, [summary]);

  const sectorData = useMemo(() => {
    if (!summary?.sector_distribution || summary.sector_distribution.length === 0) {
      return [];
    }

    const totalCount = summary.sector_distribution.reduce((acc, item) => acc + item.count, 0);
    if (totalCount === 0) {
      return [];
    }

    const sorted = [...summary.sector_distribution].sort((a, b) => b.count - a.count);

    return sorted.map((sector, index) => {
      const color =
        sectorColorMap[sector.key] ?? fallbackColors[index % fallbackColors.length];
      const percentage = Number(((sector.count / totalCount) * 100).toFixed(2));

      return {
        name: formatSectorName(sector.key),
        percentage,
        count: sector.count,
        color,
      };
    });
  }, [summary]);

  const activityData = useMemo(() => {
    if (!summary?.recent_activity) {
      return [];
    }

    return summary.recent_activity.slice(0, 10).map((activity) => {
      const message = activity.actor
        ? `${activity.actor} • ${activity.help_text}`
        : activity.help_text;

      return {
        message,
        timeAgo: formatRelativeTime(activity.timestamp),
      };
    });
  }, [summary]);

  const userName = useMemo(() => {
    if (!user) return "Admin";
    return user.first_name || user.name || user.email?.split("@")[0] || "Admin";
  }, [user]);

  const filterText = useMemo(() => {
    // Use applied filters if available, otherwise use summary window
    if (dashboardFilters.start_date && dashboardFilters.end_date) {
      return formatDateRange(dashboardFilters.start_date, dashboardFilters.end_date);
    }
    if (dashboardFilters.start_date || dashboardFilters.end_date) {
      // If only one date is selected, show it
      const date = dashboardFilters.start_date || dashboardFilters.end_date;
      const formatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });
      const dateObj = new Date(date);
      if (!Number.isNaN(dateObj.getTime())) {
        return formatter.format(dateObj);
      }
    }
    return formatDateRange(summary?.kpi.window?.from, summary?.kpi.window?.to);
  }, [summary, dashboardFilters]);

  return (
    <LayoutWrapper>
      <div className="space-y-6">
        <DashboardHeader 
          userName={userName} 
          filterText={filterText}
          onFilterChange={handleFilterChange}
          currentFilters={dashboardFilters}
        />

        {error && (
          <div className="flex items-center justify-between rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => fetchSummary(dashboardFilters)}
              className="rounded-md bg-red-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-red-500"
            >
              Retry
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-16 text-sm text-gray-500">
            Loading dashboard...
          </div>
        ) : (
          <>
            <StatsCards data={statsData} />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <AssessmentFunnel data={funnelData} />
              <SectorDistribution data={sectorData} />
            </div>

            <RecentActivity activities={activityData} />
          </>
        )}
      </div>
    </LayoutWrapper>
  );
};

export default AdminDashboard;

