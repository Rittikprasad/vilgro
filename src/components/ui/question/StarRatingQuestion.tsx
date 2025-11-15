import React from 'react'
import { cn } from "../../../lib/utils"

/**
 * Custom Star SVG component with sharp, pointed edges
 */
const SharpStar: React.FC<{ className?: string; filled?: boolean }> = ({ className, filled = false }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? "1.5" : "0.75"}
      strokeLinecap="butt"
      strokeLinejoin="miter"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      style={{ shapeRendering: "geometricPrecision" }}
    >
      <path
        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

interface StarRatingQuestionProps {
  question: string
  questionNumber?: number
  value?: number // Number of stars selected (0-4)
  onChange?: (value: number) => void
  maxStars?: number
  labels?: string[]
  disabled?: boolean
}

/**
 * Star Rating Question component
 * Displays star-based rating scale where selecting a star fills all stars up to that level
 * Traditional star rating system (1-5 stars)
 */
const StarRatingQuestion: React.FC<StarRatingQuestionProps> = ({ 
  question,
  questionNumber,
  value = 0, 
  onChange,
  maxStars = 5,
  labels = [],
  disabled = false
}) => {
  /**
   * Handles star selection
   * Updates the rating value when a star is clicked (1-based index)
   */
  
  const handleStarClick = (starIndex: number) => {
    if (!disabled) {
      onChange?.(starIndex)
    }
  }

  // Show labels if they exist (even if not matching exact count)
  const showLabels = labels && labels.length > 0;

  return (
    <div className="w-full space-y-7">
      {/* Question */}
      <p className="text-[#46B753] font-golos font-medium text-[18px] font-[500]">
        {questionNumber !== undefined && `${questionNumber}. `}{question}
      </p>
      
      {/* Star rating scale - horizontal layout with matching width containers for alignment */}
      <div className="flex gap-18">
        {Array.from({ length: maxStars }, (_, index) => {
          const starNumber = index + 1
          const isFilled = starNumber <= value
          
          return (
            <div className="flex flex-col items-center gap-2">
            <button
              key={index}
              type="button"
              onClick={() => handleStarClick(starNumber)}
              disabled={disabled}
              className={cn(
                "transition-all duration-200 hover:scale-110 focus:outline-none flex-shrink-0",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <SharpStar
                className={cn(
                  "h-10 w-10 transition-all duration-200",
                  isFilled 
                    ? "text-yellow-400" 
                    : "text-gray-500"
                )}
                filled={isFilled}
              />
            </button>
            <div className="w-30">
            {showLabels && <p className="text-[14px] font-[300] text-golos text-gray-900 text-center break-words">{labels[index] || `${index + 1}`}</p>}
            </div>
            </div>
          )
        })}
      </div>    
    </div>
  )
}

export default StarRatingQuestion
