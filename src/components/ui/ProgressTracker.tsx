import React from "react"
import { cn } from "../../lib/utils"

interface ProgressTrackerProps {
  currentStep: number
  totalSteps: number
  className?: string
}

/**
 * Progress tracker component for multi-step forms
 * Shows current step progress with numbered circles and connecting lines
 */
const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  currentStep,
  totalSteps,
  className
}) => {
  return (
    <div className={cn("flex items-center justify-center mb-8", className)}>
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1
        const isActive = stepNumber === currentStep
        const isCompleted = stepNumber < currentStep
        
        return (
          <React.Fragment key={stepNumber}>
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors",
                  isActive && "bg-[#46B753] border-[#46B753] text-white",
                  isCompleted && "bg-[#46B753] border-[#46B753] text-white",
                  !isActive && !isCompleted && "bg-white border-gray-300 text-gray-500"
                )}
              >
                {stepNumber}
              </div>
            </div>
            
            {/* Connecting line */}
            {stepNumber < totalSteps && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-4 transition-colors",
                  stepNumber < currentStep ? "bg-[#46B753]" : "bg-gray-300"
                )}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default ProgressTracker
