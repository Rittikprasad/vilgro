import React from "react"
import LayoutWrapper from "../layout/LayoutWrapper"

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
  return (
    <LayoutWrapper>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Good Morning, John Doe</h1>
            <p className="text-gray-600 mt-1">Filter: last 7 days</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total SPOs registered</h3>
            <p className="text-2xl font-bold text-gray-900">1,234</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-2">New SPOs</h3>
            <p className="text-2xl font-bold text-gray-900">56</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Completion Rate</h3>
            <p className="text-2xl font-bold text-gray-900">78%</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Loan Request Submission</h3>
            <p className="text-2xl font-bold text-gray-900">89</p>
          </div>
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Assessment Completion Funnel</h3>
            <p className="text-gray-600">Chart placeholder - Assessment completion data will be displayed here</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Sector Distribution</h3>
            <p className="text-gray-600">Chart placeholder - Sector distribution data will be displayed here</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <p className="text-gray-600">Activity log placeholder - Recent activities will be displayed here</p>
        </div>
      </div>
    </LayoutWrapper>
  )
}

export default AdminDashboard

