import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile } from '../features/auth/authThunks';
import { fetchOnboardingProgress } from '../features/onboarding/onboardingSlice';
// fetchOnboardingProgress removed - using signup flow
import Login from './login/Login';
import SignupFlow from './signup/SignupFlow';
// OnboardingFlow removed - using existing signup flow
import Welcome from './Welcome';
import Home from './Home';
import type { RootState } from '../app/store';
import Assessment from './assessment';
import SubmissionSuccess from './assessment/SubmissionSuccess';
import { 
  AdminLogin, 
  AdminDashboard,
  SPOsPage,
  QuestionsPage,
  BanksPage,
  ReviewsPage,
  AdminsPage,
  ActivityLogPage
} from '../roles/Admin';
// TODO: API Integration - Uncomment when authentication is ready
// import { ProtectedRoute as RoleProtectedRoute } from '../auth/ProtectedRoute';

/**
 * Protected Route Component
 * Redirects to login if user is not authenticated
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

/**
 * Onboarding Route Component
 * Redirects to signup flow for onboarding
 */
const OnboardingRoute: React.FC = () => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return <SignupFlow />;
};

/**
 * Auth Route Component
 * Redirects authenticated users based on their profile completion status
 */
const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch = useDispatch();
    const { isAuthenticated, user, has_completed_profile } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (isAuthenticated && user && !has_completed_profile) {
            // User is authenticated but hasn't completed profile, fetch onboarding progress
            // But only if we're not in the signup flow (to avoid API calls during signup)
            const currentPath = window.location.pathname;
            if (!currentPath.startsWith('/signup')) {
                console.log('User authenticated but profile incomplete, fetching onboarding progress...');
                // Add a small delay to ensure the user profile is fully loaded
                const timer = setTimeout(() => {
                    dispatch(fetchOnboardingProgress() as any);
                }, 200);
                
                return () => clearTimeout(timer);
            }
        }
    }, [dispatch, isAuthenticated, user, has_completed_profile]);

    if (isAuthenticated) {
        // Check if user is on login page - let login component handle navigation
        const currentPath = window.location.pathname;
        if (currentPath === '/login') {
            return <>{children}</>;
        }
        
        // For other pages, check profile completion status
        if (has_completed_profile) {
            return <Navigate to="/assessment" replace />;
        } else {
            // Check if user is already in signup flow
            if (currentPath.startsWith('/signup')) {
                // User is already in signup flow, don't redirect
                return <>{children}</>;
            } else {
                // User is authenticated but not in signup flow, redirect to step 2
                return <Navigate to="/signup/step/2" replace />;
            }
        }
    }

    return <>{children}</>;
};

/**
 * Main App Router Component
 * Handles all application routing and authentication flow
 */
const AppRouter: React.FC = () => {
    const dispatch = useDispatch();
    const { accessToken, isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);

    // Initialize authentication state on app load
    useEffect(() => {
        if (accessToken && isAuthenticated) {
            // User has valid token, fetch their profile and onboarding status
            // But only if we're not in the signup flow or login page (to avoid 404 errors for new users)
            const currentPath = window.location.pathname;
            if (!currentPath.startsWith('/signup') && currentPath !== '/login') {
                console.log('App loaded with valid token, fetching user profile...');
                // Add error handling for profile fetch to prevent 404 errors from breaking the app
                dispatch(fetchUserProfile() as any).catch((error: any) => {
                    console.warn('Profile fetch failed (expected for new users):', error);
                    // Don't break the app flow if profile fetch fails
                });
            } else {
                console.log('In signup flow or login page, skipping profile fetch to avoid 404 errors');
            }
        }
    }, [dispatch, accessToken, isAuthenticated]);

    // Show loading state while validating tokens
    if (accessToken && isAuthenticated && isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route
                    path="/"
                    element={
                        <AuthRoute>
                            <Home />
                        </AuthRoute>
                    }
                />

                <Route
                    path="/login"
                    element={
                        <AuthRoute>
                            <Login />
                        </AuthRoute>
                    }
                />

                <Route
                    path="/signup/*"
                    element={<SignupFlow />}
                />

                {/* ==================== ADMIN ROUTES ==================== */}
                {/* NOTE: Authentication is currently bypassed for development */}
                {/* TODO: API Integration - Protect this route with role-based authentication */}
                
                {/* Admin Login - Public route */}
                <Route
                    path="/admin/login"
                    element={<AdminLogin />}
                />

                {/* Admin Dashboard - Currently unprotected for development */}
                {/* TODO: API Integration - Protect this route with role-based authentication */}
                <Route
                    path="/admin/dashboard"
                    element={<AdminDashboard />}
                />

                {/* Admin SPOs Page - Currently unprotected for development */}
                {/* TODO: API Integration - Protect this route with role-based authentication */}
                <Route
                    path="/admin/spos"
                    element={<SPOsPage />}
                />

                {/* Admin Questions Page - Currently unprotected for development */}
                {/* TODO: API Integration - Protect this route with role-based authentication */}
                <Route
                    path="/admin/questions"
                    element={<QuestionsPage />}
                />

                {/* Admin Banks Page - Currently unprotected for development */}
                {/* TODO: API Integration - Protect this route with role-based authentication */}
                <Route
                    path="/admin/banks"
                    element={<BanksPage />}
                />

                {/* Admin Reviews Page - Currently unprotected for development */}
                {/* TODO: API Integration - Protect this route with role-based authentication */}
                <Route
                    path="/admin/reviews"
                    element={<ReviewsPage />}
                />

                {/* Admin Admins Page - Currently unprotected for development */}
                {/* TODO: API Integration - Protect this route with role-based authentication */}
                <Route
                    path="/admin/admins"
                    element={<AdminsPage />}
                />

                {/* Admin Activity Log Page - Currently unprotected for development */}
                {/* TODO: API Integration - Protect this route with role-based authentication */}
                <Route
                    path="/admin/activity"
                    element={<ActivityLogPage />}
                />

                {/* 
                    TODO: API Integration - Uncomment this block when authentication is ready
                    This will enable role-based protection for all admin routes
                    
                    <Route
                        path="/admin/*"
                        element={
                            <RoleProtectedRoute allowedRoles={["ADMIN"]}>
                                <Routes>
                                    <Route path="dashboard" element={<AdminDashboard />} />
                                    <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                                </Routes>
                            </RoleProtectedRoute>
                        }
                    />
                */}

                {/* SPO Protected Routes */}
                <Route
                    path="/onboarding"
                    element={
                        <ProtectedRoute>
                            <OnboardingRoute />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/onboarding/step/:step"
                    element={
                        <ProtectedRoute>
                            <OnboardingRoute />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/welcome"
                    element={
                        <ProtectedRoute>
                            <Welcome />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/assessment"
                    element={
                        <ProtectedRoute>
                            <Assessment />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/assessment/:assessmentId/success"
                    element={
                        <ProtectedRoute>
                            <SubmissionSuccess />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <div className="min-h-screen flex items-center justify-center">
                                <div className="text-center">
                                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Dashboard Coming Soon</h1>
                                    <p className="text-gray-600">Your personalized dashboard will be available here.</p>
                                </div>
                            </div>
                        </ProtectedRoute>
                    }
                />

                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;
