import React from "react";
import { cn } from "../../lib/utils";

interface AssessmentStep {
  id: string;
  label: string;
  isActive: boolean;
  isCompleted: boolean;
  progress?: {
    answered: number;
    required: number;
  };
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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 h-[80vh] overflow-y-auto sticky top-24">
      {/* Progress Steps */}
      <div className="space-y-12">
        {steps.map((step, index) => {
          // Calculate progress percentage for the connecting line
          const progressPercentage = step.progress 
            ? (step.progress.answered / step.progress.required) * 100 
            : (step.isCompleted ? 100 : 0);

          return (
            <div key={step.id} className="relative">
              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div className="absolute left-3.5 top-10 w-[5px] h-16 bg-gray-200">
                  <div 
                    className="w-1 bg-[#46B753] transition-all duration-300"
                    style={{ height: `${(progressPercentage / 100) * 65}px` }}
                  ></div>
                </div>
              )}

              {/* Step Circle and Label */}
              <div
                className={cn(
                  "flex items-center  space-x-3 cursor-pointer transition-colors",
                  onStepClick && "hover:bg-gray-50 rounded-lg p-2 -ml-2"
                )}
                onClick={() => onStepClick?.(step.id)}
              >
                {/* Step Circle */}
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-colors border-2",
                    step.isCompleted
                      ? "bg-green-600 border-green-600"
                      : step.isActive
                      ? "bg-green-600 border-green-600"
                      : "bg-gray-200 border-gray-200"
                  )}
                >
                  {step.isCompleted && (
                    <svg
                      className="w-4 h-4 text-white"
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
                  )}
                </div>

                {/* Step Label */}
                <span
                  className={cn(
                    "text-[16px] font-[400] font-golos transition-colors",
                    step.isActive
                      ? "text-green-600"
                      : step.isCompleted
                      ? "text-gray-900"
                      : "text-gray-400"
                  )}
                >
                  {step.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AssessmentSidebar;
