import React from 'react';
import ViewIcon from '../../assets/svg/view.svg';
import { Download } from 'lucide-react';

interface AssessmentDashboardProps {
  lastTestDate?: string;
  retakeDate?: string;
}

/**
 * Assessment Dashboard Component
 * Displays assessment overview for users who have already submitted assessments
 * Shows cooldown information, latest results, and assessment history
 */
const AssessmentDashboard: React.FC<AssessmentDashboardProps> = ({ 
  lastTestDate = '25-10-2025',
  retakeDate = '25-04-2026' 
}) => {

  // Mock data for assessment history
  const assessmentHistory = [
    {
      date: '25-10-2025',
      sector: 'Health',
      status: 'Completed',
      score: 'Commercial Debt with Impact Linked Financing',
    },
  ];

  const handleTakeTestAgain = () => {
    // TODO: API integration - handle test retake when cooldown expires
    console.log('Take test again clicked');
  };

  const handleViewDetails = () => {
    // TODO: API integration - navigate to latest result details
    console.log('View details clicked');
  };

  const handleViewResult = (date: string) => {
    // TODO: API integration - navigate to specific result details
    console.log('View result for:', date);
  };

  const handleDownloadResult = (date: string) => {
    // TODO: API integration - download result PDF/report
    console.log('Download result for:', date);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-30 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Start New Assessment Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-[23px] font-[600] text-gray-900 mb-4 font-golos">
              Start New Assessment
            </h2>
            <p className="text-gray-900 mb-6 text-[14px] font-[300]">
              You took the last test on <span className="font-medium">{lastTestDate}</span>. <br/>you can retake test again after 6 months on{' '}
              <span className="text-green-600 font-medium">{retakeDate}</span>
            </p>
            <button
              onClick={handleTakeTestAgain}
              disabled
              className="w-full bg-gray-100 text-gray-500 px-6 py-3 rounded-lg font-medium transition-colors cursor-not-allowed"
            >
              Take the test again
            </button>
          </div>

          {/* Latest Result Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-[23px] font-[600] text-gray-900 mb-4 font-golos">
              Latest Result
            </h2>
            <p className="text-gray-900 mb-6 text-[14px] font-[300]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <button
              onClick={handleViewDetails}
              className="w-full px-6 py-3 rounded-lg font-medium text-white transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(92deg, #46B753 0.02%, #E0DC32 100.02%)' }}
            >
              View Details
            </button>
          </div>
        </div>

        {/* Assessment History Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-[23px] font-[600] text-gray-900 mb-2 font-golos">
            Assessment History
          </h2>
          <p className="text-gray-900 mb-6 text-[14px] font-[300]">
            Track your risk assessment submissions and results
          </p>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-[14px] font-[600] text-gray-700 font-golos">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 text-[14px] font-[600] text-gray-700 font-golos">
                    Sector
                  </th>
                    <th className="text-left py-3 px-4 text-[14px] font-[600] text-gray-700 font-golos">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-[14px] font-[600] text-gray-700 font-golos">
                    Score
                  </th>
                  <th className="text-left py-3 px-4 text-[14px] font-[600] text-gray-700 font-golos">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {assessmentHistory.map((assessment, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4 text-[14px] font-[300] text-gray-900">
                      {assessment.date}
                    </td>
                    <td className="py-4 px-4 text-[14px] font-[300] text-gray-900">
                      {assessment.sector}
                    </td>
                    <td className="py-4 px-4 text-[14px] font-[300]">
                      <span className="text-green-600 font-medium">
                        {assessment.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-[14px] font-[300] text-gray-900">
                      {assessment.score}
                    </td>
                    <td className="py-4 px-4 text-[14px] font-[300]">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleViewResult(assessment.date)}
                          className="p-1.5 hover:bg-green-50 rounded transition-colors"
                          title="View"
                        >
                          <img
                            src={ViewIcon}
                            alt="View"
                            className="w-5 h-5"
                          />
                        </button>
                        <button
                          onClick={() => handleDownloadResult(assessment.date)}
                          className="p-1.5 hover:bg-green-50 rounded transition-colors text-green-600"
                          title="Download"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentDashboard;
