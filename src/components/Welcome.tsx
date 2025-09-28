import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';
import logo from '../assets/logo.png';
import type { RootState } from '../app/store';

/**
 * Welcome Component
 * Displayed after successful onboarding completion
 */
const Welcome: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state: RootState) => state.auth);

    const handleStartAssessment = () => {
        // Navigate to questionnaire/assessment flow
        navigate('/assessment');
    };

    const handleGoToDashboard = () => {
        // Navigate to main dashboard
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-6">
            <div className="max-w-2xl w-full text-center">
                {/* Logo */}
                <div className="mb-8">
                    <img src={logo} alt="Vilgro Logo" className="h-16 mx-auto" />
                </div>

                {/* Welcome Message */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                    <div className="mb-6">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>

                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            Welcome to Vilgro!
                        </h1>

                        <p className="text-xl text-gray-600 mb-4">
                            Hi {user?.first_name || user?.name || 'there'}! 👋
                        </p>

                        <p className="text-gray-600 leading-relaxed">
                            Congratulations on completing your profile setup! You're now ready to begin your
                            impact assessment journey. Our comprehensive questionnaire will help evaluate
                            your organization's potential and connect you with the right opportunities.
                        </p>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-4 py-6 border-t border-gray-100">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">50+</div>
                            <div className="text-sm text-gray-600">Questions</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">15-20</div>
                            <div className="text-sm text-gray-600">Minutes</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">100%</div>
                            <div className="text-sm text-gray-600">Personalized</div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                    <Button
                        onClick={handleStartAssessment}
                        className="w-full h-14 text-lg font-semibold text-white rounded-xl gradient-bg hover:opacity-90 transition-all transform hover:scale-105"
                    >
                        🚀 Start Your Impact Assessment
                    </Button>

                    <Button
                        onClick={handleGoToDashboard}
                        variant="outline"
                        className="w-full h-12 text-gray-700 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        Go to Dashboard
                    </Button>
                </div>

                {/* Additional Info */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500">
                        Need help? Contact our support team at{' '}
                        <a href="mailto:support@vilgro.org" className="text-green-600 hover:underline">
                            support@vilgro.org
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Welcome;
