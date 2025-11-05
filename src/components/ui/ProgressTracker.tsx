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
            <div className="flex flex-col items-center relative z-10">
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors",
                  "bg-white border-transparent",
                  isActive && "text-[#46B753]",
                  isCompleted && "text-[#46B753]",
                  !isActive && !isCompleted && "text-gray-500"
                )}
                style={
                  isActive || isCompleted
                    ? {
                        background: "linear-gradient(white, white) padding-box, linear-gradient(92deg, #46B753 0.02%, #E0DC32 100.02%) border-box",
                        borderWidth: "2px",
                      }
                    : {
                        background: "white",
                        borderColor: "#d1d5db",
                      }
                }
              >
                {stepNumber}
              </div>
            </div>
            
            {/* Connecting line */}
            {stepNumber < totalSteps && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-1 transition-colors relative",
                  stepNumber < currentStep ? "bg-[#46B753]" : "bg-gray-300"
                )}
                style={{
                  marginLeft: "-12px",
                  marginRight: "-12px",
                }}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default ProgressTracker
