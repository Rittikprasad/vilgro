import React from 'react'
import { cn } from "../../../lib/utils"
import {
  NotAtAllLikelyIcon,
  SlightlyLikelyIcon,
  SomewhatLikelyIcon,
  VeryLikelyIcon
} from "../../../assets/icons"

interface VisualRatingOption {
  value: string
  emoji?: string
  label: string
}

interface VisualRatingQuestionProps {
  question: string
  questionNumber?: number
  value?: string
  onChange?: (value: string) => void
  options?: VisualRatingOption[]
}

// Map option values to icon components
const iconMap: Record<string, React.ComponentType<any>> = {
  "0": NotAtAllLikelyIcon,
  "1": SlightlyLikelyIcon,
  "2": SomewhatLikelyIcon,
  "3": VeryLikelyIcon,
}

const VisualRatingQuestion: React.FC<VisualRatingQuestionProps> = ({ 
  question,
  questionNumber,
  value, 
  onChange,
  options = [
    { value: "0", label: "Not at all likely" },
    { value: "1", label: "Slightly likely" },
    { value: "2", label: "Somewhat likely" },
    { value: "3", label: "Very likely" }
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
      <p className="text-[#46B753] font-golos font-medium text-[18px] font-[500]">
        {questionNumber !== undefined && `${questionNumber}. `}{question}
      </p>
      
      {/* Horizontal options layout */}
      <div className="grid grid-cols-4 gap-3 p-2">
        {options.map((option) => {
          const IconComponent = iconMap[option.value]
          const isSelected = value === option.value
          
          return (
            <div
              key={option.value}
              className={cn(
                "relative rounded-lg p-[2px] transition-all duration-200",
                // Only allow hover scale when no option is selected or this option is selected
                (!value || isSelected) && "hover:scale-105",
                // Gradient border background
                isSelected
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
                  "flex flex-col w-full h-full p-4 rounded-lg bg-white focus:outline-none transition-all duration-200",
                  // Only show focus ring when not selected to avoid conflicts
                  !isSelected && "focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                )}
              >
              {/* Icon - use controlled mode to reflect selection state */}
              <div className="mb-2 flex items-center justify-center">
                {IconComponent && (
                  <IconComponent
                    isActive={isSelected}
                    defaultColor={value && !isSelected ? "#9CA3AF" : "#231F20"}
                    activeColor="black"
                    size={35}
                    onClick={() => {}} // Prevent double click handling
                  />
                )}
              </div>
            
              {/* Label text - grey out when unselected */}
              <span 
                className={cn(
                  "label-text text-center leading-tight transition-all duration-200 text-lg break-words text-golos",
                  // Ensure selected option has normal text color, grey out only unselected options
                  isSelected
                    ? "text-gray-700"
                    : value 
                      ? "text-gray-400"
                      : "text-gray-700"
                )}
                style={{
                  fontWeight: 400,
                  fontStyle: 'normal',
                  fontSize: '14px',
                }}
              >
                {option.label}
              </span>
            </button>
          </div>
        )
        })}
      </div>
    </div>
  )
}

export default VisualRatingQuestion
