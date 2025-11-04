import React from 'react'
import { Star } from "lucide-react"
import { cn } from "../../../lib/utils"

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
  console.log('StarRatingQuestion - question:', question);
  console.log('StarRatingQuestion - labels prop:', labels);
  console.log('StarRatingQuestion - maxStars:', maxStars);
  
  const handleStarClick = (starIndex: number) => {
    if (!disabled) {
      onChange?.(starIndex)
    }
  }

  // Show labels if they exist (even if not matching exact count)
  const showLabels = labels && labels.length > 0;
  console.log('StarRatingQuestion - showLabels:', showLabels, 'labels length:', labels?.length);

  return (
    <div className="w-full space-y-7">
      {/* Question */}
      <p className="text-green-600 font-golos font-medium text-xl">
        {questionNumber !== undefined && `${questionNumber}. `}{question}
      </p>
      
      {/* Star rating scale - horizontal layout with matching width containers for alignment */}
      <div className="flex items-center gap-12">
        {Array.from({ length: maxStars }, (_, index) => {
          const starNumber = index + 1
          const isFilled = starNumber <= value
          
          return (
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
              <Star
                className={cn(
                  "h-10 w-10 transition-all duration-200",
                  isFilled 
                    ? "fill-yellow-400 text-yellow-400" 
                    : "fill-none text-gray-500 stroke-1"
                )}
              />
            </button>
          )
        })}
      </div>

      {/* Optional labels below stars - show if labels are provided */}
      {showLabels && (
        <div className="flex items-start gap-12">
          {Array.from({ length: maxStars }, (_, index) => (
            <div 
              key={index} 
              className="text-xs text-gray-600 text-center flex-shrink-0 break-words"
              style={{
                fontFamily: 'Golos Text',
                fontWeight: 400,
                fontStyle: 'normal',
                fontSize: '12px',
                width: '2.5rem', // Match star width (40px = 2.5rem)
                wordWrap: 'break-word',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                display: 'block'
              }}
            >
              {labels[index] || `${index + 1}`}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default StarRatingQuestion
