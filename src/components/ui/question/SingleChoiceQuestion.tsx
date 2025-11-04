import React from 'react'
import { RadioGroup, RadioGroupItem } from '../RadioGroup'

interface SingleChoiceQuestionProps {
  question: string
  questionNumber?: number
  value?: string
  onChange?: (value: string) => void
  options?: { value: string; label: string }[]
  columns?: 1 | 2
  disabled?: boolean
}

/**
 * Custom Single Choice Question component
 * Displays radio button options in configurable column layout (1 or 2 columns)
 */
const SingleChoiceQuestion: React.FC<SingleChoiceQuestionProps> = ({ 
  question,
  questionNumber,
  value, 
  onChange,
  columns = 1,
  options = [
    { value: "1", label: "Minimal innovation; follows established practices with little change." },
    { value: "2", label: "Minimal innovation; follows established practices with little change." },
    { value: "3", label: "Minimal innovation; follows established practices with little change." },
    { value: "4", label: "Minimal innovation; follows established practices with little change." },
    { value: "5", label: "Minimal innovation; follows established practices with little change." }
  ]
}) => {
  return (
    <div className="w-full space-y-7">
      {/* Question */}
      <p className="text-[#46B753] font-golos font-medium text-[18px] font-[500]">
        {questionNumber !== undefined && `${questionNumber}. `}{question}
      </p>
      
      {/* Configurable column grid for options */}
      <RadioGroup 
        value={value} 
        onValueChange={onChange}
        className={`grid gap-3 ${columns === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value} id={option.value} />
            <label 
              htmlFor={option.value}
              className="text-base font-golos !font-[300] !text-[14px] peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              {option.label}
            </label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}

export default SingleChoiceQuestion