import React from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "./useAuth"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
  redirectTo?: string
}

/**
 * Protected Route Component
 * Handles authentication and role-based access control
 * @param children - Child components to render if authorized
 * @param allowedRoles - Array of roles allowed to access the route
 * @param redirectTo - Path to redirect if not authorized
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  redirectTo = "/login",
}) => {
  const { isAuthenticated, role, isLoading } = useAuth()

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  // Check role-based access if allowedRoles is specified
  if (allowedRoles && allowedRoles.length > 0) {
    if (!role || !allowedRoles.includes(role)) {
      // Redirect to appropriate login page based on attempted access
      const adminAttempt = allowedRoles.includes("ADMIN")
      return <Navigate to={adminAttempt ? "/signin/admin" : "/login"} replace />
    }
  }

  return <>{children}</>
}

