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
import LoanRequestForm from './loan/LoanRequestForm';
import AssessmentDashboard from './assessment/AssessmentDashboard';
import EnterEmail from './forgot-password/EnterEmail';
import EnterCode from './forgot-password/EnterCode';
import CreateNewPassword from './forgot-password/CreateNewPassword';
import {
  AdminLogin,
  AdminDashboard,
  SPOsPage,
  SPOProfilePage,
  QuestionsPage,
  BanksPage,
  ReviewsPage,
  AdminsPage,
  ActivityLogPage,
  ProfilePage,
} from '../roles/Admin';
import { BankingLogin, BankingSPOsPage, BankingSPOProfilePage } from '../roles/Banking';
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
 * Handles basic authentication checks and profile completion redirects
 * Excludes signup and assessment routes to allow direct navigation
 */
const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch = useDispatch();
    const { isAuthenticated, user, has_completed_profile } = useSelector((state: RootState) => state.auth);
    const currentPath = window.location.pathname;

    // Skip all logic for signup and assessment routes
    if (currentPath.startsWith('/signup') || currentPath.startsWith('/assessment')) {
        return <>{children}</>;
    }

    // Fetch onboarding progress for incomplete profiles (only on non-signup routes)
    useEffect(() => {
        if (isAuthenticated && user && !has_completed_profile && !currentPath.startsWith('/signup')) {
            const timer = setTimeout(() => {
                dispatch(fetchOnboardingProgress() as any);
            }, 200);
            return () => clearTimeout(timer);
        }
    }, [dispatch, isAuthenticated, user, has_completed_profile, currentPath]);

    // Handle login page - let login component handle its own navigation
    if (currentPath === '/login') {
        return <>{children}</>;
    }

    // For authenticated users on other pages, check profile completion
    if (isAuthenticated) {
        if (has_completed_profile) {
            // Profile complete - allow access
            return <>{children}</>;
        } else {
            // Profile incomplete - redirect to signup (but not if already in signup)
            if (!currentPath.startsWith('/signup')) {
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

                {/* Forgot Password Flow */}
                <Route
                    path="/forgot-password"
                    element={<EnterEmail />}
                />
                <Route
                    path="/forgot-password/enter-code"
                    element={<EnterCode />}
                />
                <Route
                    path="/forgot-password/create-new-password"
                    element={<CreateNewPassword />}
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
                    path="/signin/admin"
                    element={<AdminLogin />}
                />

                <Route
                    path="/signin/banking"
                    element={<BankingLogin />}
                />

                {/* Admin Dashboard - Currently unprotected for development */}
                {/* TODO: API Integration - Protect this route with role-based authentication */}
                <Route
                    path="/admin/dashboard"
                    element={<AdminDashboard />}
                />

                <Route
                    path="/banking/dashboard"
                    element={<BankingSPOsPage />}
                />
                <Route
                    path="/banking/spos/:spoId"
                    element={<BankingSPOProfilePage />}
                />

                {/* Admin SPOs Page - Currently unprotected for development */}
                {/* TODO: API Integration - Protect this route with role-based authentication */}
                <Route
                    path="/admin/spos"
                    element={<SPOsPage />}
                />
                <Route
                    path="/admin/spos/:spoId"
                    element={<SPOProfilePage />}
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
                <Route
                    path="/admin/profile"
                    element={<ProfilePage />}
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
                    path="/assessment/dashboard"
                    element={
                        <ProtectedRoute>
                            <AssessmentDashboard />
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
                    path="/loan/request/:assessmentId?"
                    element={
                        <ProtectedRoute>
                            <LoanRequestForm />
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
