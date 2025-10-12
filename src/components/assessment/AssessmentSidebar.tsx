import React from "react";
import { cn } from "../../lib/utils";

interface AssessmentStep {
  id: string;
  label: string;
  isActive: boolean;
  isCompleted: boolean;
}

interface AssessmentSidebarProps {
  steps: AssessmentStep[];
  currentStep: string;
  onStepClick?: (stepId: string) => void;
}

const AssessmentSidebar: React.FC<AssessmentSidebarProps> = ({
  steps,
  onStepClick,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-[80vh] overflow-y-auto sticky top-24">
      {/* Progress Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.id} className="relative">
            {/* Connecting Line */}
            {index < steps.length - 1 && (
              <div className="absolute left-4 top-8 w-0.5 h-12 bg-gray-200">
                {step.isCompleted && (
                  <div className="w-0.5 h-12 bg-green-600"></div>
                )}
                {step.isActive && !step.isCompleted && (
                  <div className="w-0.5 h-6 bg-green-600"></div>
                )}
              </div>
            )}

            {/* Step Circle and Label */}
            <div
              className={cn(
                "flex items-center space-x-3 cursor-pointer transition-colors",
                onStepClick && "hover:bg-gray-50 rounded-lg p-2 -ml-2"
              )}
              onClick={() => onStepClick?.(step.id)}
            >
              {/* Step Circle */}
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                  step.isCompleted
                    ? "bg-green-600 text-white"
                    : step.isActive
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-500"
                )}
              >
                {step.isCompleted ? (
                  <svg
                    className="w-4 h-4"
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
                ) : (
                  index + 1
                )}
              </div>

              {/* Step Label */}
              <span
                className={cn(
                  "text-sm font-medium transition-colors",
                  step.isActive
                    ? "text-green-600"
                    : step.isCompleted
                    ? "text-gray-900"
                    : "text-gray-500"
                )}
              >
                {step.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssessmentSidebar;
