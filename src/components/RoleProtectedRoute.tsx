import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
}

/**
 * Role Protected Route Component
 * Protects routes based on user role
 * Redirects to appropriate login page if user doesn't have required role
 */
export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
  children,
  allowedRoles,
  redirectTo,
}) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  // If not authenticated, redirect to appropriate login
  if (!isAuthenticated || !user) {
    if (allowedRoles.includes('ADMIN')) {
      return <Navigate to="/signin/admin" replace />;
    }
    if (allowedRoles.includes('BANK_USER')) {
      return <Navigate to="/signin/banking" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  const userRole = user.role?.toUpperCase();
  const hasAccess = allowedRoles.some(role => role.toUpperCase() === userRole);

  if (!hasAccess) {
    // Redirect based on user's actual role
    if (userRole === 'ADMIN') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    if (userRole === 'BANK_USER') {
      return <Navigate to="/banking/dashboard" replace />;
    }
    if (userRole === 'SPO') {
      return <Navigate to="/assessment" replace />;
    }
    // Default redirect
    return <Navigate to={redirectTo || "/login"} replace />;
  }

  return <>{children}</>;
};

export default RoleProtectedRoute;

