import React from 'react'
import { Star } from "lucide-react"
import { cn } from "../../../lib/utils"

interface StarRatingQuestionProps {
  question: string
  value?: number // Number of stars selected (0-4)
  onChange?: (value: number) => void
  maxStars?: number
  labels?: string[]
}

/**
 * Star Rating Question component
 * Displays star-based rating scale where selecting a star fills all stars up to that level
 * Traditional star rating system (1-5 stars)
 */
const StarRatingQuestion: React.FC<StarRatingQuestionProps> = ({ 
  question, 
  value = 0, 
  onChange,
  maxStars = 4,
  labels = [
    "Quality is inconsistent.",
    "Quality is better",
    "Quality meets standards",
    "Quality exceeds expectations"
  ]
}) => {
  /**
   * Handles star selection
   * Updates the rating value when a star is clicked (1-based index)
   */
  const handleStarClick = (starIndex: number) => {
    onChange?.(starIndex)
  }

  return (
    <div className="w-full space-y-4">
      {/* Question */}
      <p className="text-green-600 font-medium">{question}</p>
      
      {/* Star rating scale - left aligned like question */}
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: maxStars }, (_, index) => {
          const starNumber = index + 1
          const isFilled = starNumber <= value
          
          return (
            <button
              key={index}
              type="button"
              onClick={() => handleStarClick(starNumber)}
              className="flex flex-col items-center space-y-2 p-2 transition-all duration-200 hover:scale-105 focus:outline-none"
            >
              {/* Star Icon */}
              <Star
                className={cn(
                  "h-8 w-8 transition-all duration-200",
                  isFilled 
                    ? "fill-yellow-400 text-yellow-400" // Filled star
                    : "fill-none text-gray-400 stroke-1" // Outline star
                )}
              />
              
              {/* Label for this star */}
              <span className="label-text text-center leading-tight">
                {labels[index]}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default StarRatingQuestion
