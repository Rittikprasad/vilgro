import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../ui/Navbar';
import { Button } from '../ui/Button';

const SubmissionSuccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F8F6F0] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Thank You Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Thank You!
          </h1>
          
          <p className="text-lg text-gray-700 mb-2">
            Your response has been submitted successfully.
          </p>
          
          <p className="text-sm text-gray-500 mb-8">
            We appreciate you taking the time to complete the assessment.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => navigate('/')}
              variant="gradient"
              size="lg"
              className="w-full"
            >
              Go to Home
            </Button>
            
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full px-6 py-3 text-green-600 font-medium hover:bg-green-50 rounded-lg transition-colors"
            >
              View Dashboard
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubmissionSuccess;

