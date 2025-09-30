import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
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
    const { step } = useParams<{ step?: string }>();

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Use the signup flow for onboarding
    // Pass the step parameter if available
    const initialStep = step ? parseInt(step, 10) : undefined;
    return <SignupFlow initialStep={initialStep} />;
};

/**
 * Auth Route Component
 * Redirects authenticated users based on their profile completion status
 */
const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (isAuthenticated && user && !user.has_completed_profile) {
            // User is authenticated but hasn't completed profile, fetch onboarding progress
            console.log('User authenticated but profile incomplete, fetching onboarding progress...');
            dispatch(fetchOnboardingProgress() as any);
        }
    }, [dispatch, isAuthenticated, user]);

    // If user is authenticated, redirect based on profile completion
    if (isAuthenticated) {
        if (user?.has_completed_profile) {
            return <Navigate to="/assessment" replace />;
        } else {
            return <Navigate to="/signup?step=1" replace />;
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
            console.log('App loaded with valid token, fetching user profile...');
            dispatch(fetchUserProfile() as any);
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
                    path="/signup"
                    element={<SignupFlow />}
                />

                {/* Protected Routes */}
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

                {/* Future Routes */}
                <Route
                    path="/assessment"
                    element={
                        <ProtectedRoute>
                            <div className="min-h-screen flex items-center justify-center">
                                <div className="text-center">
                                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Assessment Coming Soon</h1>
                                    <p className="text-gray-600">The assessment questionnaire will be available here.</p>
                                </div>
                            </div>
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
