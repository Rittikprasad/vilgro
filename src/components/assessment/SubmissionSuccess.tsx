import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from '../ui/Button';
import Navbar from '../ui/Navbar';
import {
  getLoanEligibility,
  getResults,
} from '../../features/assessment/assessmentSlice';
import type { RootState } from '../../app/store';
import { useAppDispatch } from '../../app/hooks';
import { generateUserAssessmentPDF } from '../../utils/generateUserAssessmentPDF';

const SubmissionSuccess: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { assessmentId } = useParams<{ assessmentId: string }>();
  
  // Get results from Redux store
  const assessmentResult = useSelector((state: RootState) => state.assessment.results);
  const eligibility = useSelector((state: RootState) => state.assessment.eligibility);
  const isLoading = useSelector((state: RootState) => state.assessment.isLoading);
  const error = useSelector((state: RootState) => state.assessment.error);
  const user = useSelector((state: RootState) => state.auth.user);
  
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

  // Get scores for grid visualization
  const impactScore = assessmentResult?.graph.scores.sections.IMPACT ?? 0;
  const riskScore = assessmentResult?.graph.scores.sections.RISK ?? 0;
  const returnScore = assessmentResult?.graph.scores.sections.RETURN ?? 0;

  // Map scores (0-100) to determine how many rows should be filled from bottom
  // Each row represents a 20-point range: 0-20, 21-40, 41-60, 61-80, 81-100
  // Higher scores fill more rows from the bottom (row 4) upward
  const getFilledRowCount = (score: number): number => {
    if (score === 0) return 0;
    if (score <= 20) return 1;  // Fill 1 row (bottom row)
    if (score <= 40) return 2;  // Fill 2 rows (bottom 2 rows)
    if (score <= 60) return 3;  // Fill 3 rows (bottom 3 rows)
    if (score <= 80) return 4;  // Fill 4 rows (bottom 4 rows)
    return 5;  // Fill all 5 rows
  };

  const impactFilledRows = getFilledRowCount(impactScore);
  const riskFilledRows = getFilledRowCount(riskScore);
  const returnFilledRows = getFilledRowCount(returnScore);

  // Determine cell color based on row and column
  // Row 0 is top, row 4 is bottom. We fill from bottom up.
  const getCellColor = (row: number, column: 'impact' | 'risk' | 'return'): string => {
    const filledCount = column === 'impact' ? impactFilledRows : column === 'risk' ? riskFilledRows : returnFilledRows;
    
    // Calculate which rows should be filled (from bottom up)
    // If filledCount is 3, rows 2, 3, 4 should be colored (0-indexed: 2, 3, 4)
    // Row index from bottom: 4 - row (so row 4 = 0 from bottom, row 0 = 4 from bottom)
    const rowFromBottom = 4 - row;
    
    // If this row is within the filled range (from bottom), color it
    if (rowFromBottom < filledCount) {
      if (column === 'impact') return '#60C460'; // Green
      if (column === 'risk') return '#D2DC64'; // Light yellow/Chartreuse
      if (column === 'return') return '#F0AA32'; // Orange/Amber
    }
    return '#F0F0F0'; // Light grey for inactive cells
  };

  // Get overall score
  const overallScore = eligibility?.overall_score ?? assessmentResult?.scores.overall ?? 0;

  // Determine eligibility based on overall score (threshold can be adjusted)
  const isEligible = eligibility?.is_eligible ?? overallScore >= 10;
  const cooldownUntil = assessmentResult?.cooldown_until
    ? new Date(assessmentResult.cooldown_until)
    : null;
  const isCooldownActive = cooldownUntil ? cooldownUntil > new Date() : false;

  // Get instrument from API response, fallback to default if not available
  const getInstrumentRecommendation = () => {
    if (assessmentResult?.instrument) {
      return assessmentResult.instrument;
    }
    // Fallback to default if instrument is not in API response
    // return "Commercial Debt with Impact Linked Financing";
  };
  const instrumentDescription = assessmentResult?.instrument_description;

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
                    onClick={() => {
                      try {
                        generateUserAssessmentPDF({
                          user,
                          assessmentResult,
                        });
                      } catch (err) {
                        console.error("Failed to generate PDF report", err);
                      }
                    }}
                  >
                    Download Result
                  </Button>
                </div>
              </div>

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
                <p className="text-[13px] font-[400] text-gray-600 mt-2">
                  {instrumentDescription}
                </p>
              </div>

              {/* Grid Visualization - Impact, Risk, Return */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="w-full">
                  {/* Grid Container */}
                  <div className="grid grid-cols-3 gap-4">
                    {/* Column Headers */}
                    <div className="text-center font-semibold text-gray-800 text-sm">Impact</div>
                    <div className="text-center font-semibold text-gray-800 text-sm">Risk</div>
                    <div className="text-center font-semibold text-gray-800 text-sm">Return</div>
                    
                    {/* Grid Cells - 5 rows x 3 columns */}
                    {[0, 1, 2, 3, 4].map((row) => (
                      <React.Fragment key={row}>
                        {/* Impact Column */}
                        <div
                          className="h-16 rounded-lg transition-colors duration-200"
                          style={{ backgroundColor: getCellColor(row, 'impact') }}
                        />
                        {/* Risk Column */}
                        <div
                          className="h-16 rounded-lg transition-colors duration-200"
                          style={{ backgroundColor: getCellColor(row, 'risk') }}
                        />
                        {/* Return Column */}
                        <div
                          className="h-16 rounded-lg transition-colors duration-200"
                          style={{ backgroundColor: getCellColor(row, 'return') }}
                        />
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Next Steps Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Recommendations</h3>
              {eligibility?.details ? (
                <div className="space-y-4 mb-6">
                  {/* {eligibility.details.reason && (
                    <div className="mb-4">
                      <p className="text-[14px] font-[500] text-gray-800 mb-2">Overall Assessment:</p>
                      <p className="text-[14px] font-[300] text-gray-600">
                        {eligibility.details.reason}
                      </p>
                    </div>
                  )} */}
                  
                  {eligibility.details.sections && (
                    <div className="space-y-4">
                      {Object.entries(eligibility.details.sections).map(([sectionName, sectionData]) => (
                        <div key={sectionName} className="border-l-4 border-green-500 pl-4">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-[14px] font-[600] text-gray-800 capitalize">
                              {sectionName}
                            </h4>
                            <span
                              className={`text-xs px-2 py-0.5 rounded ${
                                sectionData.gate_pass
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {sectionData.gate_pass ? 'Pass' : 'Fail'}
                            </span>
                          </div>
                          <p className="text-[13px] font-[300] text-gray-600">
                            {sectionData.recommendation}
                          </p>
                          {sectionData.criteria?.notes && (
                            <p className="text-[12px] font-[300] text-gray-500 mt-1 italic">
                              {sectionData.criteria.notes}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-600 mb-6 text-[14px] font-[300]">
                  Loading recommendations...
                </p>
              )}
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
                  onClick={() => {
                    // Send the user back to the landing page to start over
                    navigate("/");
                  }}
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

