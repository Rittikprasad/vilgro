import React from "react";
import AssessmentSidebar from "./AssessmentSidebar";
import { Button } from "../ui/Button";

interface AssessmentStep {
  id: string;
  label: string;
  isActive: boolean;
  isCompleted: boolean;
}

interface AssessmentLayoutProps {
  // Sidebar props
  steps: AssessmentStep[];
  currentStep: string;
  onStepClick?: (stepId: string) => void;

  // Progress bar props
  progressPercent: number;

  // Content
  children: React.ReactNode;

  // Navigation
  onBack?: () => void;
  onNext?: () => void;
  showBackButton?: boolean;
  showNextButton?: boolean;
  nextButtonText?: string;
  nextButtonDisabled?: boolean;
}

const AssessmentLayout: React.FC<AssessmentLayoutProps> = ({
  // Sidebar props
  steps,
  currentStep,
  onStepClick,

  // Progress bar props
  progressPercent,

  // Content
  children,

  // Navigation
  onBack,
  onNext,
  showBackButton = true,
  showNextButton = true,
  nextButtonText = "Next",
  nextButtonDisabled = false,
}) => {

  return (
    <div className="pt-30 p-6 bg-[#F8F6F0]">
      <div className="max-w-7xl mx-auto flex gap-6">
        {/* Sidebar Card */}
        <div className="w-64 flex-shrink-0">
          <AssessmentSidebar
            steps={steps}
            currentStep={currentStep}
            onStepClick={onStepClick}
          />
        </div>

        {/* Main Content Card */}
        <div className="flex-1 h-[80vh]">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 h-full flex flex-col">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <div className="text-[25px] font-bold text-[#46B753]">Progress</div>
                <div className="text-sm font-medium text-gray-700">
                  {Math.round(progressPercent)}%
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>

            {/* Questions Content */}
            <div className="flex-1 space-y-8 overflow-y-auto mb-6 pt-6 border-t border-gray-100">
              {children}
            </div>

            {/* Navigation Buttons - Fixed at bottom */}
            {(showBackButton || showNextButton) && (
              <div className="flex justify-end items-center gap-3 pt-6 border-t border-gray-100">
                {/* Back Button */}
                {showBackButton && onBack && (
                  <Button
                    onClick={onBack}
                    variant="gradient"
                    size="lg"
                  >
                    Back
                  </Button>
                )}

                {/* Next Button */}
                {showNextButton && onNext && (
                  <Button
                    onClick={onNext}
                    disabled={nextButtonDisabled}
                    variant="gradient"
                    size="lg"
                  >
                    {nextButtonText}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentLayout;
