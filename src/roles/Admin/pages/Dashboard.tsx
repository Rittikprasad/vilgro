import React from "react";
import LayoutWrapper from "../layout/LayoutWrapper";
import DashboardHeader from "./Dashboard/DashboardHeader";
import StatsCards from "./Dashboard/StatsCards";
import AssessmentFunnel from "./Dashboard/AssessmentFunnel";
import SectorDistribution from "./Dashboard/SectorDistribution";
import RecentActivity from "./Dashboard/RecentActivity";

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
  // Dummy data for stats cards
  const statsData = [
    { title: "Total SPOs registered", value: "3000", gradient: true },
    { title: "New SPOs", value: "27" },
    { title: "Completion Rate", value: "67%" },
    { title: "Loan Request Submission", value: "9" },
  ];

  // Dummy data for assessment funnel
  const funnelData = [
    { label: "Registered", count: 27, percentage: 100 },
    { label: "Completed Basic information about the information", count: 25, percentage: 92.6 },
    { label: "Completed Impact", count: 20, percentage: 74.1 },
    { label: "Completed Risk", count: 20, percentage: 74.1 },
    { label: "Completed Return", count: 15, percentage: 55.6 },
  ];

  // Dummy data for sector distribution
  const sectorData = [
    { name: "Agriculture", percentage: 20, count: 8, color: "#FFC107" },
    { name: "Waste management / Recycling", percentage: 15, count: 6, color: "#66B2FF" },
    { name: "Health", percentage: 25, count: 10, color: "#FF9800" },
    { name: "Livelihood creation", percentage: 15, count: 6, color: "#9C27B0" },
    { name: "Others", percentage: 25, count: 10, color: "#4CAF50" },
  ];

  // Dummy data for recent activity
  const activityData = [
    { message: "New bank user registered: HDFC Bank", timeAgo: "2 hours ago" },
    { message: "New bank user registered: HDFC Bank", timeAgo: "2 hours ago" },
    { message: "New bank user registered: HDFC Bank", timeAgo: "2 hours ago" },
  ];

  return (
    <LayoutWrapper>
      <div className="space-y-6">
        <DashboardHeader userName="John Doe" filterText="last 7 days" />

        <StatsCards data={statsData} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AssessmentFunnel data={funnelData} />
          <SectorDistribution data={sectorData} />
        </div>

        <RecentActivity activities={activityData} />
      </div>
    </LayoutWrapper>
  );
};

export default AdminDashboard;

