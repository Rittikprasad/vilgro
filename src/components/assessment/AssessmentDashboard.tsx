import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ViewIcon from '../../assets/svg/view.svg';
import { Download } from 'lucide-react';
import { Button } from '../ui/Button';
import Navbar from '../ui/Navbar';
import { assessmentApi, type AssessmentHistory } from '../../services/assessmentApi';
import type { RootState } from '../../app/store';
import { generateUserAssessmentPDF } from '../../utils/generateUserAssessmentPDF';
import { getResults } from '../../features/assessment/assessmentSlice';

interface AssessmentDashboardProps {
  lastTestDate?: string;
  retakeDate?: string;
}

/**
 * Assessment Dashboard Component
 * Displays assessment overview for users who have already submitted assessments
 * Shows cooldown information, latest results, and assessment history
 */
const AssessmentDashboard: React.FC<AssessmentDashboardProps> = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [history, setHistory] = useState<AssessmentHistory['assessments']>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | number | null>(null);
  
  const user = useSelector((state: RootState) => state.auth.user);

  // Simple date formatter to DD-MM-YYYY, falls back to '-'
  const formatDate = (value?: string | null) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '-';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Format cooldown date/time: show time if today, date if later
  const formatCooldownUntil = (cooldownUntil?: string | null): string => {
    if (!cooldownUntil) return '';
    
    const cooldownDate = new Date(cooldownUntil);
    if (Number.isNaN(cooldownDate.getTime())) return '';
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const cooldownDay = new Date(cooldownDate.getFullYear(), cooldownDate.getMonth(), cooldownDate.getDate());
    
    // Check if cooldown is today
    if (cooldownDay.getTime() === today.getTime()) {
      // Show time (e.g., "at 3:45 PM")
      const hours = cooldownDate.getHours();
      const minutes = cooldownDate.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      const displayMinutes = String(minutes).padStart(2, '0');
      return `at ${displayHours}:${displayMinutes} ${ampm}`;
    } else {
      // Show date (e.g., "on 15 January 2025")
      const day = cooldownDate.getDate();
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const month = monthNames[cooldownDate.getMonth()];
      const year = cooldownDate.getFullYear();
      return `on ${day} ${month} ${year}`;
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await assessmentApi.getHistory();
        if (!isMounted) return;
        // If backend ever sends full list of assessments for the user
        setHistory(data.assessments ?? []);
      } catch (err: any) {
        if (!isMounted) return;
        console.error('Failed to fetch assessment history:', err);
        const message =
          err?.response?.data?.message ||
          err?.message ||
          'Failed to load assessment history.';
        setError(message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchHistory();

    return () => {
      isMounted = false;
    };
  }, []);

  // Latest assessment by submitted_at (fallback to started_at)
  // The backend response for history includes more fields than our minimal type,
  // so we treat each entry as a generic object when accessing optional fields.
  const latestAssessment = useMemo(() => {
    if (!history.length) return null;
    return [...history].sort((a, b) => {
      const aAny = a as any;
      const bAny = b as any;
      const aDate = new Date(aAny.submitted_at || aAny.started_at).getTime();
      const bDate = new Date(bAny.submitted_at || bAny.started_at).getTime();
      return bDate - aDate;
    })[0];
  }, [history]);

  const lastTestDate = latestAssessment
    ? formatDate(
        (latestAssessment as any).submitted_at ||
          (latestAssessment as any).started_at
      )
    : '-';

  // Get cooldown until date for display
  const cooldownUntil = latestAssessment
    ? (latestAssessment as any).cooldown_until
    : null;
  const cooldownDisplay = formatCooldownUntil(cooldownUntil);

  // Enable retake button only when cooldown has passed and we have an assessment
  const canRetake =
    !!latestAssessment &&
    (!cooldownUntil || new Date(cooldownUntil).getTime() <= Date.now());

  const handleTakeTestAgain = () => {
    // TODO: API integration - start a new assessment when cooldown expires
    console.log('Take test again clicked');
  };

  const handleViewDetails = () => {
    if (!history.length) return;
    const firstAssessment: any = history[0];
    if (!firstAssessment?.id) return;
    navigate(`/assessment/${firstAssessment.id}/success`);
  };

  const handleViewResult = (assessment: any) => {
    if (!assessment?.id) return;
    navigate(`/assessment/${assessment.id}/success`);
  };

  const handleViewAnswers = (assessment: any) => {
    if (!assessment?.id) return;
    navigate(`/assessment/${assessment.id}/responses`);
  };

  const handleDownloadResult = async (assessment: any) => {
    if (!assessment?.id) return;
    
    const assessmentId = assessment.id;
    setDownloadingId(assessmentId);
    
    try {
      // Fetch the assessment result data
      const assessmentResult = await dispatch(
        getResults(assessmentId) as any
      ).unwrap();
      
      // Generate PDF with user data and assessment result
      generateUserAssessmentPDF({
        user,
        assessmentResult,
      });
    } catch (err) {
      console.error("Failed to generate PDF report", err);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-30 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 px-4 py-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-800">
            {error}
          </div>
        )}
        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Start New Assessment Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-[23px] font-[600] text-gray-900 mb-4 font-golos">
              Start New Assessment
            </h2>
            <p className="text-gray-900 mb-6 text-[14px] font-[300]">
              You took the last test on{" "}
              <span className="font-medium">{lastTestDate}</span>. <br />
              {cooldownUntil && !canRetake ? (
                <>
                  You can retake the test again{" "}
                  <span className="text-green-600 font-medium">{cooldownDisplay}</span>.
                </>
              ) : (
                "You can retake the test now."
              )}
            </p>
            <Button
              onClick={handleTakeTestAgain}
              disabled={!canRetake}
              variant="outline"
              className="w-full"
            >
              Take the test again
            </Button>
          </div>

          {/* Latest Result Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-[23px] font-[600] text-gray-900 mb-4 font-golos">
              Latest Result
            </h2>
            <p className="text-gray-900 mb-12 text-[14px] font-[300]">
              {latestAssessment
                ? `Overall score: ${
                    (latestAssessment as any).scores?.overall ?? '-'
                  } | Sector: ${(latestAssessment as any).sector ?? '-'}`
                : "-"}
            </p>
            <Button
              onClick={handleViewDetails}
              disabled={!latestAssessment}
              variant="gradient"
              className="w-full"
            >
              View Details
            </Button>
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
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-4 px-4 text-[14px] font-[300] text-gray-500 text-center"
                    >
                      Loading assessment history...
                    </td>
                  </tr>
                ) : history.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-4 px-4 text-[14px] font-[300] text-gray-500 text-center"
                    >
                      No assessments found.
                    </td>
                  </tr>
                ) : (
                  history.map((assessment, index) => {
                    const item: any = assessment;
                    const dateLabel = formatDate(
                      item.submitted_at || item.started_at
                    );
                    const sectorLabel = item.sector ?? '-';
                    const statusLabel = item.status ?? '-';
                    const scoreLabel =
                      item.scores?.overall !== undefined &&
                      item.scores?.overall !== null
                        ? item.scores.overall
                        : '-';

                    return (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4 text-[14px] font-[300] text-gray-900">
                      {dateLabel}
                    </td>
                    <td className="py-4 px-4 text-[14px] font-[300] text-gray-900">
                      {sectorLabel}
                    </td>
                    <td className="py-4 px-4 text-[14px] font-[300]">
                      <span className="text-green-600 font-medium">
                        {statusLabel}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-[14px] font-[300] text-gray-900">
                      {scoreLabel}
                    </td>
                    <td className="py-4 px-4 text-[14px] font-[300]">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleViewResult(item)}
                          className="p-1.5 hover:bg-green-50 rounded transition-colors"
                          title="View"
                          disabled={!item?.id}
                        >
                          <img
                            src={ViewIcon}
                            alt="View"
                            className="w-5 h-5"
                          />
                        </button>
                        <button
                          onClick={() => handleViewAnswers(item)}
                          className={`${
                            item?.id
                              ? "text-[#69C24E] underline transition-colors hover:text-[#46B753]"
                              : "text-gray-400 cursor-not-allowed"
                          } text-sm font-medium`}
                          disabled={!item?.id}
                          title="View Answers"
                        >
                          View Answers
                        </button>
                        <button
                          onClick={() => handleDownloadResult(item)}
                          className="p-1.5 hover:bg-green-50 rounded transition-colors text-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Download"
                          disabled={!item?.id || downloadingId === item.id}
                        >
                          {downloadingId === item.id ? (
                            <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Download className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default AssessmentDashboard;
