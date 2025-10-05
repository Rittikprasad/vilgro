import React from 'react'
import { cn } from "../../../lib/utils"

interface VisualRatingOption {
  value: string
  emoji: string
  label: string
}

interface VisualRatingQuestionProps {
  question: string
  value?: string
  onChange?: (value: string) => void
  options?: VisualRatingOption[]
}

/**
 * Visual Rating Question component
 * Displays emoji-based rating options in horizontal layout with gradient borders
 * Single selection with visual feedback on hover and selection
 */
const VisualRatingQuestion: React.FC<VisualRatingQuestionProps> = ({ 
  question, 
  value, 
  onChange,
  options = [
    { value: "limited", emoji: "😞", label: "Limited potential for financial returns" },
    { value: "moderate", emoji: "😐", label: "Moderate potential for financial returns" },
    { value: "strong", emoji: "😊", label: "Strong potential for financial returns" },
    { value: "excellent", emoji: "😄", label: "Excellent potential for financial returns" }
  ]
}) => {
  /**
   * Handles option selection
   * Updates the selected value when an option is clicked
   */
  const handleOptionClick = (optionValue: string) => {
    onChange?.(optionValue)
  }

  return (
    <div className="w-full space-y-4">
      {/* Question */}
      <p className="text-green-600 font-medium">{question}</p>
      
      {/* Horizontal options layout */}
      <div className="grid grid-cols-4 gap-3">
        {options.map((option) => (
          <div
            key={option.value}
            className={cn(
              "relative rounded-lg p-[2px] transition-all duration-200",
              // Only allow hover scale when no option is selected or this option is selected
              (!value || value === option.value) && "hover:scale-105",
              // Gradient border background
              value === option.value 
                ? "bg-gradient-to-b from-[#46B753] to-[#E0DC32]" // Selected: normal gradient
                : value 
                  ? "bg-gradient-to-b from-gray-300 to-gray-400" // Unselected: grey gradient
                  : "bg-gradient-to-b from-[#46B753] to-[#E0DC32]", // No selection: normal gradient
              // Hover shadow only when no selection made
              !value && "hover:shadow-md"
            )}
          >
            <button
              type="button"
              onClick={() => handleOptionClick(option.value)}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full p-4 rounded-lg bg-white focus:outline-none transition-all duration-200",
                // Only show focus ring when not selected to avoid conflicts
                value !== option.value && "focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              )}
            >
            {/* Emoji - always keep normal colors */}
            <div className="text-3xl mb-2">
              {option.emoji}
            </div>
            
              {/* Label text - grey out when unselected */}
              <span className={cn(
                "label-text text-center leading-tight transition-all duration-200",
                // Ensure selected option has normal text color, grey out only unselected options
                value === option.value 
                  ? "text-gray-900" // Selected: normal dark text
                  : value 
                    ? "text-gray-400" // Unselected when another is selected: grey text
                    : "text-gray-900" // No selection: normal dark text
              )}>
                {option.label}
              </span>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default VisualRatingQuestion
