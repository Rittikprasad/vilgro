import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import Navbar from '../ui/Navbar';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from 'recharts';

const SubmissionSuccess: React.FC = () => {
  const navigate = useNavigate();

  // Sample data for the scatter plot - 3 variables: Risk, Impact, Return
  const chartData = [
    { risk: 22, impact: 67, return: 67 }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100">

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-25">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overall Score Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Overall Score</h2>
              
              {/* Eligibility Message */}
              <div className="flex items-start space-x-4 mb-8">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-lg text-gray-700">
                    Based on your responses, we believe <span className="text-green-600 font-semibold">you are eligible</span> for philanthropic funding.
                  </p>
                </div>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                    className="border-green-500 text-green-600 hover:bg-green-50"
                  >
                    Go back to the dashboard
                  </Button>
                  <Button
                    variant="gradient"
                    onClick={() => {/* TODO: Implement download functionality */}}
                  >
                    Download Result
                  </Button>
                </div>
              </div>

              {/* Instrument Recommendation */}
              <div className="mb-8">
                <p className="text-gray-700 mb-2">
                  The instrument most appropriate for your current stage and profile is
                </p>
                <p className="text-xl font-semibold text-green-600">
                  Commercial Debt with Impact Linked Financing
                </p>
              </div>

              {/* Scatter Plot - 3 Variables: Risk vs Impact/Return */}
              <div className="bg-white border border-gray-200 rounded-lg p-2">
                <div className="w-full h-80 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart
                      data={chartData}
                      margin={{
                        top: 20,
                        right: 40,
                        bottom: 40,
                        left: 40,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      
                      {/* X-Axis: Risk */}
                      <XAxis 
                        type="number" 
                        dataKey="risk" 
                        name="Risk"
                        domain={[0, 100]}
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                        axisLine={{ stroke: '#6b7280' }}
                        tickLine={{ stroke: '#6b7280' }}
                        label={{ value: 'Risk', position: 'insideBottom', offset: -10, style: { textAnchor: 'middle', fill: '#374151' } }}
                      />
                      
                      {/* Left Y-Axis: Impact */}
                      <YAxis 
                        yAxisId="left"
                        type="number" 
                        dataKey="impact" 
                        name="Impact"
                        domain={[0, 100]}
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                        axisLine={{ stroke: '#6b7280' }}
                        tickLine={{ stroke: '#6b7280' }}
                        label={{ value: 'Impact', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#374151' } }}
                      />
                      
                      {/* Right Y-Axis: Return */}
                      <YAxis 
                        yAxisId="right"
                        type="number" 
                        dataKey="return" 
                        name="Return"
                        domain={[0, 100]}
                        orientation="right"
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                        axisLine={{ stroke: '#6b7280' }}
                        tickLine={{ stroke: '#6b7280' }}
                        label={{ value: 'Return', angle: 90, position: 'insideRight', style: { textAnchor: 'middle', fill: '#374151' } }}
                      />
                      
                      {/* Impact Data Points */}
                      <Scatter 
                        yAxisId="left"
                        dataKey="impact" 
                        fill="#10b981" 
                        stroke="#059669"
                        strokeWidth={2}
                        r={8}
                      />
                      
                      {/* Return Data Points (same position as Impact) */}
                      <Scatter 
                        yAxisId="right"
                        dataKey="return" 
                        fill="#10b981" 
                        stroke="#059669"
                        strokeWidth={2}
                        r={8}
                      />
                      
                      {/* Horizontal reference lines connecting Impact and Return values */}
                      <ReferenceLine 
                        yAxisId="left"
                        y={75} 
                        stroke="#d1d5db" 
                        strokeDasharray="3 3" 
                        strokeWidth={1}
                      />
                      <ReferenceLine 
                        yAxisId="left"
                        y={50} 
                        stroke="#d1d5db" 
                        strokeDasharray="3 3" 
                        strokeWidth={1}
                      />
                      <ReferenceLine 
                        yAxisId="left"
                        y={25} 
                        stroke="#d1d5db" 
                        strokeDasharray="3 3" 
                        strokeWidth={1}
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                  
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Next Steps Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Next Steps</h3>
              <p className="text-gray-600 mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <div className="space-y-3">
                <Button
                  variant="gradient"
                  size="lg"
                  className="w-full"
                  onClick={() => {/* TODO: Implement loan application */}}
                >
                  Apply for Loan
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={() => {/* TODO: Implement retake test */}}
                >
                  Take the test again
                </Button>
              </div>
              <p className="text-orange-500 text-sm mt-4">
                You can retake test again after 6 months
              </p>
            </div>

            {/* Contact Info Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <p className="text-gray-700 mb-2">
                To know more info contact us at:
              </p>
              <a 
                href="mailto:abc@villgro.org" 
                className="text-green-600 hover:text-green-700 font-medium"
              >
                abc@villgro.org
              </a>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default SubmissionSuccess;

