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
  totalQuestions: number;
  answeredQuestions: number;

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
  totalQuestions,
  answeredQuestions,

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
  const progressPercentage = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;

  return (
    <div className="pt-30 p-6">
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
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 h-full">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm font-medium text-gray-700">Progress</div>
                <div className="text-sm font-medium text-gray-700">
                  {answeredQuestions}/{totalQuestions} questions answered
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Questions Content */}
            <div className="space-y-8">
              {children}
            </div>

            {/* Navigation Buttons */}
            {(showBackButton || showNextButton) && (
              <div className="flex justify-end items-end gap-3 h-[400px]">
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
