import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Check } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/Button";
import { getFeedbackMeta, submitFeedback } from "../../features/assessment/assessmentSlice";
import type { RootState } from "../../app/store";
import { Input } from "../ui/Input";

interface AssessmentExitModalProps {
  isOpen: boolean;
  assessmentId: string | number;
  onSubmit: () => void;
  onSkip: () => void;
}

/**
 * Custom Checkbox component matching MultipleChoiceQuestion style
 * Square-shaped checkbox with tick indicator and gradient styling
 */
const Checkbox: React.FC<{
  id?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
}> = ({ 
  id, 
  checked = false, 
  onCheckedChange, 
  className 
}) => {
  const handleClick = () => {
    onCheckedChange?.(!checked);
  };

  return (
    <button
      id={id}
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={handleClick}
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-sm border-2 border-gray-300 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
        checked && "bg-gradient-to-r from-[#46B753] to-[#E0DC32] border-transparent",
        className
      )}
    >
      {checked && (
        <div className="flex items-center justify-center text-white">
          <Check className="h-3 w-3" />
        </div>
      )}
    </button>
  );
};

const AssessmentExitModal: React.FC<AssessmentExitModalProps> = ({
  isOpen,
  assessmentId,
  onSubmit,
  onSkip,
}) => {
  const dispatch = useDispatch();
  const { feedbackReasons, feedbackMetaLoading, isSubmittingFeedback } = useSelector(
    (state: RootState) => state.assessment
  );
  
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [comment, setComment] = useState<string>('');

  // Fetch feedback reasons when modal opens
  useEffect(() => {
    if (isOpen && feedbackReasons.length === 0) {
      dispatch(getFeedbackMeta() as any);
    }
  }, [isOpen, dispatch, feedbackReasons.length]);

  if (!isOpen) return null;

  const handleCheckboxChange = (reasonKey: string, checked: boolean) => {
    if (checked) {
      setSelectedReasons((prev) => [...prev, reasonKey]);
    } else {
      setSelectedReasons((prev) => prev.filter((r) => r !== reasonKey));
      // Clear comment if "other" is deselected
      if (reasonKey === 'other') {
        setComment('');
      }
    }
  };

  const handleSubmit = async () => {
    if (selectedReasons.length === 0) {
      // Allow submit even without reasons (user can skip)
      onSubmit();
      return;
    }

    try {
      const payload = {
        assessment: assessmentId,
        reasons: selectedReasons,
        ...(comment.trim() && { comment: comment.trim() }),
      };
      
      await dispatch(submitFeedback(payload) as any);
      setSelectedReasons([]);
      setComment('');
      onSubmit();
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      // Still proceed with navigation even if feedback submission fails
      onSubmit();
    }
  };

  const handleSkip = () => {
    setSelectedReasons([]);
    setComment('');
    onSkip();
  };

  const isOtherSelected = selectedReasons.includes('other');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={handleSkip}
      />

      {/* Modal */}
      <div 
        className="relative bg-white rounded-lg shadow-xl p-8 w-full max-w-lg mx-4 border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <h2 className="text-gray-400 font-golos font-medium text-[12px] font-[400]">
          Feedback on your experience
        </h2>

        {/* Sub-heading */}
        <h3 className="text-gray-900 font-golos text-[16px] font-[700] mb-7">
          Why are you leaving in between?
        </h3>

        {/* Checkbox Options */}
        <div className="space-y-3 mb-8">
          {feedbackMetaLoading ? (
            <div className="text-sm text-gray-500">Loading feedback options...</div>
          ) : feedbackReasons.length > 0 ? (
            feedbackReasons.map((reason) => (
              <div key={reason.key} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={reason.key}
                    checked={selectedReasons.includes(reason.key)}
                    onCheckedChange={(checked) => handleCheckboxChange(reason.key, checked as boolean)}
                  />
                  <label 
                    htmlFor={reason.key}
                    className="text-base font-golos !font-[300] !text-[14px] peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {reason.label}
                  </label>
                </div>
                {/* Comment field for "other" option */}
                {reason.key === 'other' && isOtherSelected && (
                  <div className="ml-6 mt-2">
                    <Input
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Please specify..."
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500">No feedback options available</div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 justify-end">
          
          <Button
            onClick={handleSubmit}
            variant="gradient"
            size="lg"
            className="min-w-[100px] text-white"
            disabled={isSubmittingFeedback}
            style={{
              fontFamily: 'Golos Text',
              fontWeight: 500,
              fontSize: '14px',
            }}
          >
            {isSubmittingFeedback ? 'Submitting...' : 'Submit'}
          </Button>
          <Button
            onClick={handleSkip}
            variant="outline"
            size="lg"
            className="min-w-[100px] border-2"
            style={{
              borderColor: '#E0DC32',
              fontFamily: 'Golos Text',
              fontWeight: 500,
              fontSize: '14px',
            }}
          >
            Skip
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentExitModal;

