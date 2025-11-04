import React from 'react'
import { cn } from "../../../lib/utils"

interface VisualRatingOption {
  value: string
  emoji: string
  label: string
}

interface VisualRatingQuestionProps {
  question: string
  questionNumber?: number
  value?: string
  onChange?: (value: string) => void
  options?: VisualRatingOption[]
}


const VisualRatingQuestion: React.FC<VisualRatingQuestionProps> = ({ 
  question,
  questionNumber,
  value, 
  onChange,
  options = [
    { value: "0", emoji: "😞", label: "Not at all likely" },
    { value: "1", emoji: "😐", label: "Slightly likely" },
    { value: "2", emoji: "😊", label: "Somewhat likely" },
    { value: "3", emoji: "😄", label: "Very likely" },
    { value: "4", emoji: "🥳", label: "Extremely likely" }
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
    <div className="w-full space-y-7">
      {/* Question */}
      <p className="text-green-600 font-golos font-medium text-xl">
        {questionNumber !== undefined && `${questionNumber}. `}{question}
      </p>
      
      {/* Horizontal options layout */}
      <div className="grid grid-cols-5 gap-3 p-2">
        {options.map((option) => (
          <div
            key={option.value}
            className={cn(
              "relative rounded-lg p-[2px] transition-all duration-200",
              // Only allow hover scale when no option is selected or this option is selected
              (!value || value === option.value) && "hover:scale-105",
              // Gradient border background
              value === option.value 
                ? "bg-gradient-to-b from-[#46B753] to-[#E0DC32]"
                : value 
                  ? "bg-gradient-to-b from-gray-300 to-gray-400"
                  : "bg-gradient-to-b from-[#46B753] to-[#E0DC32]",
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
              <span 
                className={cn(
                  "label-text text-center leading-tight transition-all duration-200 text-xs break-words",
                  // Ensure selected option has normal text color, grey out only unselected options
                  value === option.value 
                    ? "text-gray-900"
                    : value 
                      ? "text-gray-400"
                      : "text-gray-900"
                )}
                style={{
                  fontFamily: 'Golos Text',
                  fontWeight: 400,
                  fontStyle: 'normal',
                  fontSize: '12px',
                  wordWrap: 'break-word',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                  display: 'block',
                  maxWidth: '100%'
                }}
              >
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
