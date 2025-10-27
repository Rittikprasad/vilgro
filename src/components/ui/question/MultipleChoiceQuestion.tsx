import React from 'react'
import { Check } from "lucide-react"
import { cn } from "../../../lib/utils"

interface CheckboxProps {
  id?: string
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  className?: string
}

/**
 * Custom Checkbox component for individual checkbox items
 * Square-shaped checkbox with tick indicator and gradient styling
 */
const Checkbox: React.FC<CheckboxProps> = ({ 
  id, 
  checked = false, 
  onCheckedChange, 
  className 
}) => {
  const handleClick = () => {
    onCheckedChange?.(!checked)
  }

  return (
    <button
      id={id}
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={handleClick}
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-sm border-2 border-gray-300 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
        checked && "bg-gradient-to-r from-[#46B753] to-[#E0DC32] border-transparent",
        className
      )}
    >
      {checked && (
        <div className="flex items-center justify-center text-white">
          <Check className="h-3 w-3" />
        </div>
      )}
    </button>
  )
}

interface MultipleChoiceQuestionProps {
  question: string
  questionNumber?: number
  value?: string[]
  onChange?: (values: string[]) => void
  options?: { value: string; label: string }[]
  columns?: 1 | 2
  disabled?: boolean
}

/**
 * Multiple Choice Question component
 * Displays checkbox options in configurable column layout (1 or 2 columns)
 * Allows multiple selections with square checkboxes and tick indicators
 */
const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({ 
  question,
  questionNumber,
  value = [], 
  onChange,
  columns = 1,
  disabled = false,
  options = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
    { value: "option4", label: "Option 4" },
    { value: "option5", label: "Option 5" }
  ]
}) => {
  // Ensure value is always an array
  const selectedValues = Array.isArray(value) ? value : [];

  /**
   * Handles checkbox selection/deselection
   * Updates the selected values array based on checkbox state
   */
  const handleCheckboxChange = (optionValue: string, checked: boolean) => {
    if (!onChange || disabled) return

    if (checked) {
      // Add option to selected values if not already present
      onChange([...selectedValues, optionValue])
    } else {
      // Remove option from selected values
      onChange(selectedValues.filter(val => val !== optionValue))
    }
  }

  return (
    <div className="w-full space-y-4">
      {/* Question */}
      <p className="text-green-600 font-medium">
        {questionNumber !== undefined && `${questionNumber}. `}{question}
      </p>
      
      {/* Configurable column grid for options */}
      <div className={`grid gap-3 ${columns === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <Checkbox
              id={option.value}
              checked={selectedValues.includes(option.value)}
              onCheckedChange={(checked) => handleCheckboxChange(option.value, checked as boolean)}
            />
            <label 
              htmlFor={option.value}
              className="label-text text-base font-golos font-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MultipleChoiceQuestion
