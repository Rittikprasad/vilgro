import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "../auth/useAuth"
import {
  AdminDashboard,
  SPOsPage,
  SPOProfilePage,
  QuestionsPage,
  BanksPage,
  ReviewsPage,
  AdminsPage,
  ActivityLogPage,
  ProfilePage,
} from "../roles/Admin"
import { BankingSPOsPage, BankingSPOProfilePage } from "../roles/Banking"
import Assessment from "../components/assessment"

/**
 * Role Router Component
 * Routes users to appropriate role-specific routes based on their role
 * This will be expanded as we add more role-specific features
 */
export const RoleRouter: React.FC = () => {
  const { role, isAuthenticated } = useAuth()

  // For development: allow admin routes even without authentication
  // TODO: Remove this when authentication is properly integrated
  const isAdminRoute = window.location.pathname.startsWith('/admin')
  
  if (!isAuthenticated && !isAdminRoute) {
    return null
  }

  // Admin role routes - allow access for development
  // TODO: Add proper role check when authentication is integrated
  if (role === "ADMIN" || isAdminRoute) {
    return (
      <Routes>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/spos" element={<SPOsPage />} />
        <Route path="/admin/spos/:spoId" element={<SPOProfilePage />} />
        <Route path="/admin/questions" element={<QuestionsPage />} />
        <Route path="/admin/banks" element={<BanksPage />} />
        <Route path="/admin/reviews" element={<ReviewsPage />} />
        <Route path="/admin/admins" element={<AdminsPage />} />
        <Route path="/admin/activity" element={<ActivityLogPage />} />
        <Route path="/admin/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    )
  }

  if (role === "BANKING") {
    return (
      <Routes>
        <Route path="/banking/spos" element={<BankingSPOsPage />} />
        <Route path="/banking/spos/:spoId" element={<BankingSPOProfilePage />} />
        <Route path="*" element={<Navigate to="/banking/spos" replace />} />
      </Routes>
    )
  }

  // SPO role routes (using existing components)
  if (role === "SPO") {
    return (
      <Routes>
        <Route path="/assessment" element={<Assessment />} />
        <Route path="*" element={<Navigate to="/assessment" replace />} />
      </Routes>
    )
  }

  // Default fallback
  return <Navigate to="/login" replace />
}

