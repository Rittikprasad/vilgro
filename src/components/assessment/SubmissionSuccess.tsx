import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from '../ui/Button';
import Navbar from '../ui/Navbar';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from 'recharts';
import {
  getLoanEligibility,
  getResults,
  getAssessmentReport,
} from '../../features/assessment/assessmentSlice';
import type { RootState } from '../../app/store';
import { useAppDispatch } from '../../app/hooks';

const SubmissionSuccess: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { assessmentId } = useParams<{ assessmentId: string }>();
  
  // Get results from Redux store
  const assessmentResult = useSelector((state: RootState) => state.assessment.results);
  const eligibility = useSelector((state: RootState) => state.assessment.eligibility);
  const isLoading = useSelector((state: RootState) => state.assessment.isLoading);
  const error = useSelector((state: RootState) => state.assessment.error);
  const isReportDownloading = useSelector(
    (state: RootState) => state.assessment.isReportDownloading
  );
  const reportError = useSelector((state: RootState) => state.assessment.reportError);
  
  // Fetch results when component mounts
  useEffect(() => {
    if (assessmentId) {
      dispatch(getResults(assessmentId));
      dispatch(getLoanEligibility(assessmentId));
    }
  }, [assessmentId, dispatch]);

  // Show loading state while fetching
  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading results...</p>
          </div>
        </div>
      </>
    );
  }

  // Show error state
  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button
              variant="outline"
              onClick={() => assessmentId && dispatch(getResults(assessmentId) as any)}
            >
              Retry
            </Button>
          </div>
        </div>
      </>
    );
  }

  // Prepare chart data from assessment result
  // One bubble: X = Impact, Y = Risk, size = Return
  const chartData = assessmentResult 
    ? [{
        impact: assessmentResult.graph.scores.sections.IMPACT,
        risk: assessmentResult.graph.scores.sections.RISK,
        return: assessmentResult.graph.scores.sections.RETURN,
      }]
    : [{ impact: 0, risk: 0, return: 0 }];

  // Get overall score
  const overallScore = eligibility?.overall_score ?? assessmentResult?.scores.overall ?? 0;

  // Determine eligibility based on overall score (threshold can be adjusted)
  const isEligible = eligibility?.is_eligible ?? overallScore >= 10;
  const cooldownUntil = assessmentResult?.cooldown_until
    ? new Date(assessmentResult.cooldown_until)
    : null;
  const isCooldownActive = cooldownUntil ? cooldownUntil > new Date() : false;

  // Generate instrument recommendation based on scores
  const getInstrumentRecommendation = () => {
    if (!assessmentResult) return "Commercial Debt with Impact Linked Financing";
    
    const { RISK, IMPACT, RETURN } = assessmentResult.graph.scores.sections;
    
    // Simple logic for instrument recommendation
    if (RISK < 10 && IMPACT > 50 && RETURN < 30) {
      return "Grant Funding";
    } else if (RISK < 30 && RETURN > 50) {
      return "Commercial Debt with Impact Linked Financing";
    } else if (RETURN > 70) {
      return "Equity Investment";
    } else {
      return "Mezzanine Financing";
    }
  };

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
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-[23px] font-[600] font-golos text-gray-800 mb-6">
                  Overall Score: {overallScore.toFixed(2)}
                </h2>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/assessment/dashboard', { replace: true })}
                    className="border-green-500 text-green-600 hover:bg-green-50"
                  >
                    Go back to the dashboard
                  </Button>
                  <Button
                    variant="gradient"
                    onClick={async () => {
                      if (!assessmentId) return;
                      try {
                        const result = await dispatch(
                          getAssessmentReport(assessmentId)
                        ).unwrap();
                        const link = document.createElement("a");
                        link.href = result.url;
                        link.setAttribute("download", result.filename);
                        document.body.appendChild(link);
                        link.click();
                        link.remove();
                        window.URL.revokeObjectURL(result.url);
                      } catch (err) {
                        console.error("Failed to download assessment report", err);
                      }
                    }}
                    disabled={isReportDownloading}
                  >
                    {isReportDownloading ? "Downloading..." : "Download Result"}
                  </Button>
                </div>
              </div>

              {reportError && (
                <p className="mb-4 rounded-md border border-yellow-200 bg-yellow-50 px-3 py-2 text-sm text-yellow-700">
                  {reportError}
                </p>
              )}
              
              {/* Eligibility Message */}
              <div className="flex items-start space-x-4 mb-8">
                <div className={`w-8 h-8 ${isEligible ? 'bg-green-100' : 'bg-red-100'} rounded-full flex items-center justify-center flex-shrink-0`}>
                  {isEligible ? (
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-[15px] font-[400] text-gray-700">
                    Based on your responses,<br/> we believe <span className={`${isEligible ? 'text-green-600' : 'text-red-600'} font-semibold`}>
                      you are {isEligible ? 'eligible' : 'not eligible'}
                    </span> for philanthropic funding.
                  </p>
                </div>
                
              </div>

              {/* Instrument Recommendation */}
              <div className="mb-8">
                <p className="text-gray-700 mb-2 text-[14px] font-[400] font-golos">
                  <span className="font-bold">The instrument</span> most appropriate for your current stage and profile is
                </p>
                <p className="text-[25px] font-[500] text-green-600 font-golos">
                  {getInstrumentRecommendation()}
                </p>
              </div>

              {/* Scatter Plot - Impact (X) vs Risk (Y), Bubble size = Return */}
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
                      
                      {/* X-Axis: Impact */}
                      <XAxis 
                        type="number" 
                        dataKey="impact" 
                        name="Impact"
                        domain={[0, 100]}
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                        axisLine={{ stroke: '#6b7280' }}
                        tickLine={{ stroke: '#6b7280' }}
                        label={{ value: 'Impact', position: 'insideBottom', offset: -10, style: { textAnchor: 'middle', fill: '#374151' } }}
                      />
                      
                      {/* Y-Axis: Risk */}
                      <YAxis 
                        type="number" 
                        dataKey="risk" 
                        name="Risk"
                        domain={[0, 100]}
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                        axisLine={{ stroke: '#6b7280' }}
                        tickLine={{ stroke: '#6b7280' }}
                        label={{ value: 'Risk', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#374151' } }}
                      />
                      
                      {/* Single Bubble: Position at (Impact, Risk), Size based on Return value */}
                      <Scatter 
                        data={chartData}
                        fill="#10b981" 
                        stroke="#059669"
                        strokeWidth={2}
                        shape={(props: any) => {
                          const { cx, cy, payload } = props;
                          // Calculate bubble size based on return value (0-100 maps to radius 5-30)
                          const minRadius = 5;
                          const maxRadius = 30;
                          const returnValue = payload?.return || 0;
                          const radius = minRadius + (returnValue / 100) * (maxRadius - minRadius);
                          return (
                            <g>
                              {/* Bubble (larger circle, size based on return) */}
                              <circle
                                cx={cx}
                                cy={cy}
                                r={radius}
                                fill="#10b981"
                                stroke="#059669"
                                strokeWidth={2}
                                opacity={0.7}
                              />
                              {/* Point (smaller dot at center) */}
                              <circle
                                cx={cx}
                                cy={cy}
                                r={4}
                                fill="#059669"
                                stroke="#ffffff"
                                strokeWidth={1.5}
                              />
                            </g>
                          );
                        }}
                      />
                      
                      {/* Vertical reference lines at 25, 50, 75 for Impact */}
                      <ReferenceLine 
                        x={25} 
                        stroke="#d1d5db" 
                        strokeDasharray="3 3" 
                        strokeWidth={1}
                      />
                      <ReferenceLine 
                        x={50} 
                        stroke="#d1d5db" 
                        strokeDasharray="3 3" 
                        strokeWidth={1}
                      />
                      <ReferenceLine 
                        x={75} 
                        stroke="#d1d5db" 
                        strokeDasharray="3 3" 
                        strokeWidth={1}
                      />
                      
                      {/* Horizontal reference lines at 25, 50, 75 for Risk */}
                      <ReferenceLine 
                        y={25} 
                        stroke="#d1d5db" 
                        strokeDasharray="3 3" 
                        strokeWidth={1}
                      />
                      <ReferenceLine 
                        y={50} 
                        stroke="#d1d5db" 
                        strokeDasharray="3 3" 
                        strokeWidth={1}
                      />
                      <ReferenceLine 
                        y={75} 
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
              <p className="text-gray-600 mb-6 text-[14px] font-[300]">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <div className="space-y-3">
                <Button
                  variant={isEligible ? "gradient" : "outline"}
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    if (assessmentId) {
                      navigate(`/loan/request/${assessmentId}`);
                    } else {
                      navigate("/loan/request");
                    }
                  }}
                  disabled={!isEligible}
                >
                  Apply for Loan
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={() => {/* TODO: Implement retake test */}}
                  disabled={isCooldownActive}
                >
                  Take the test again
                </Button>
              </div>
              {isCooldownActive ? (
                <p className="text-orange-500 text-sm mt-4">
                  You can retake the test on{" "}
                  {cooldownUntil?.toLocaleDateString(undefined, {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                  .
                </p>
              ) : (
                <p className="text-green-600 text-sm mt-4">
                  You can retake the test now.
                </p>
              )}
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

