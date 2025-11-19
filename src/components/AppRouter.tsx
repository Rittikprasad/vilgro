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
  ProfilePage as AdminProfilePage,
  SPOResponsesPage,
} from '../roles/Admin';
import { BankingLogin, BankingSPOsPage, BankingSPOProfilePage, BankingProfilePage, BankingSPOResponsesPage } from '../roles/Banking';
import { RoleProtectedRoute } from './RoleProtectedRoute';
import ProfileDetailSpo from './profile-detail/ProfileDetailSpo';

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

    // Skip all logic for signup and assessment routes (they have their own role protection)
    if (currentPath.startsWith('/signup') || currentPath.startsWith('/assessment')) {
        return <>{children}</>;
    }

    // Skip role checks for login pages and public routes
    if (currentPath === '/login' || currentPath.startsWith('/signin/') || currentPath.startsWith('/forgot-password')) {
        return <>{children}</>;
    }

    // Fetch onboarding progress for incomplete profiles (only on non-signup routes and SPO users)
    useEffect(() => {
        if (isAuthenticated && user && !has_completed_profile && !currentPath.startsWith('/signup')) {
            const userRole = user.role?.toUpperCase();
            // Only fetch onboarding for SPO users
            if (userRole === 'SPO') {
                const timer = setTimeout(() => {
                    dispatch(fetchOnboardingProgress() as any);
                }, 200);
                return () => clearTimeout(timer);
            }
        }
    }, [dispatch, isAuthenticated, user, has_completed_profile, currentPath]);

    // For authenticated users on other pages, check profile completion (only for SPO)
    if (isAuthenticated && user) {
        const userRole = user.role?.toUpperCase();
        
        // For SPO users, check profile completion
        if (userRole === 'SPO') {
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
        // For ADMIN and BANK_USER, allow access (they don't need profile completion)
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

                {/* Signup Flow - Step 1 is public (account creation), Steps 2-5 require SPO role */}
                <Route
                    path="/signup/*"
                    element={<SignupFlow />}
                />

                {/* ==================== ADMIN ROUTES ==================== */}
                {/* Admin Login - Public route */}
                <Route
                    path="/signin/admin"
                    element={<AdminLogin />}
                />

                {/* Banking Login - Public route */}
                <Route
                    path="/signin/banking"
                    element={<BankingLogin />}
                />

                {/* Admin Dashboard - Protected with ADMIN role */}
                <Route
                    path="/admin/dashboard"
                    element={
                        <RoleProtectedRoute allowedRoles={['ADMIN']}>
                            <AdminDashboard />
                        </RoleProtectedRoute>
                    }
                />

                {/* Admin SPOs Page - Protected with ADMIN role */}
                <Route
                    path="/admin/spos"
                    element={
                        <RoleProtectedRoute allowedRoles={['ADMIN']}>
                            <SPOsPage />
                        </RoleProtectedRoute>
                    }
                />
                <Route
                    path="/admin/spos/:spoId"
                    element={
                        <RoleProtectedRoute allowedRoles={['ADMIN']}>
                            <SPOProfilePage />
                        </RoleProtectedRoute>
                    }
                />
                <Route
                    path="/admin/spos/:spoId/responses"
                    element={
                        <RoleProtectedRoute allowedRoles={['ADMIN']}>
                            <SPOResponsesPage />
                        </RoleProtectedRoute>
                    }
                />

                {/* Admin Questions Page - Protected with ADMIN role */}
                <Route
                    path="/admin/questions"
                    element={
                        <RoleProtectedRoute allowedRoles={['ADMIN']}>
                            <QuestionsPage />
                        </RoleProtectedRoute>
                    }
                />

                {/* Admin Banks Page - Protected with ADMIN role */}
                <Route
                    path="/admin/banks"
                    element={
                        <RoleProtectedRoute allowedRoles={['ADMIN']}>
                            <BanksPage />
                        </RoleProtectedRoute>
                    }
                />

                {/* Admin Reviews Page - Protected with ADMIN role */}
                <Route
                    path="/admin/reviews"
                    element={
                        <RoleProtectedRoute allowedRoles={['ADMIN']}>
                            <ReviewsPage />
                        </RoleProtectedRoute>
                    }
                />

                {/* Admin Admins Page - Protected with ADMIN role */}
                <Route
                    path="/admin/admins"
                    element={
                        <RoleProtectedRoute allowedRoles={['ADMIN']}>
                            <AdminsPage />
                        </RoleProtectedRoute>
                    }
                />

                {/* Admin Activity Log Page - Protected with ADMIN role */}
                <Route
                    path="/admin/activity"
                    element={
                        <RoleProtectedRoute allowedRoles={['ADMIN']}>
                            <ActivityLogPage />
                        </RoleProtectedRoute>
                    }
                />
                <Route
                    path="/admin/profile"
                    element={
                        <RoleProtectedRoute allowedRoles={['ADMIN']}>
                            <AdminProfilePage />
                        </RoleProtectedRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <RoleProtectedRoute allowedRoles={['SPO']}>
                            <ProfileDetailSpo />
                        </RoleProtectedRoute>
                    }
                />

                {/* ==================== BANKING ROUTES ==================== */}
                {/* Banking Dashboard - Protected with BANK_USER role */}
                <Route
                    path="/banking/dashboard"
                    element={
                        <RoleProtectedRoute allowedRoles={['BANK_USER']}>
                            <BankingSPOsPage />
                        </RoleProtectedRoute>
                    }
                />
                <Route
                    path="/banking/spos/:spoId"
                    element={
                        <RoleProtectedRoute allowedRoles={['BANK_USER']}>
                            <BankingSPOProfilePage />
                        </RoleProtectedRoute>
                    }
                />
                <Route
                    path="/banking/spos/:spoId/responses"
                    element={
                        <RoleProtectedRoute allowedRoles={['BANK_USER']}>
                            <BankingSPOResponsesPage />
                        </RoleProtectedRoute>
                    }
                />
                <Route
                    path="/banking/profile"
                    element={
                        <RoleProtectedRoute allowedRoles={['BANK_USER']}>
                            <BankingProfilePage />
                        </RoleProtectedRoute>
                    }
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

                {/* ==================== SPO PROTECTED ROUTES ==================== */}
                <Route
                    path="/onboarding"
                    element={
                        <RoleProtectedRoute allowedRoles={['SPO']}>
                            <OnboardingRoute />
                        </RoleProtectedRoute>
                    }
                />

                <Route
                    path="/onboarding/step/:step"
                    element={
                        <RoleProtectedRoute allowedRoles={['SPO']}>
                            <OnboardingRoute />
                        </RoleProtectedRoute>
                    }
                />

                <Route
                    path="/welcome"
                    element={
                        <RoleProtectedRoute allowedRoles={['SPO']}>
                            <Welcome />
                        </RoleProtectedRoute>
                    }
                />

                <Route
                    path="/assessment"
                    element={
                        <RoleProtectedRoute allowedRoles={['SPO']}>
                            <Assessment />
                        </RoleProtectedRoute>
                    }
                />

                <Route
                    path="/assessment/dashboard"
                    element={
                        <RoleProtectedRoute allowedRoles={['SPO']}>
                            <AssessmentDashboard />
                        </RoleProtectedRoute>
                    }
                />

                <Route
                    path="/assessment/:assessmentId/success"
                    element={
                        <RoleProtectedRoute allowedRoles={['SPO']}>
                            <SubmissionSuccess />
                        </RoleProtectedRoute>
                    }
                />

                <Route
                    path="/loan/request/:assessmentId?"
                    element={
                        <RoleProtectedRoute allowedRoles={['SPO']}>
                            <LoanRequestForm />
                        </RoleProtectedRoute>
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
