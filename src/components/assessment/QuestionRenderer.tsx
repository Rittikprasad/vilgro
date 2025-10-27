import React from 'react';
import SingleChoiceQuestion from '../ui/question/SingleChoiceQuestion';
import MultipleChoiceQuestion from '../ui/question/MultipleChoiceQuestion';
import SliderQuestion from '../ui/question/SliderQuestion';
import StarRatingQuestion from '../ui/question/StarRatingQuestion';

interface QuestionOption {
  label: string;
  value: string;
  points: string;
}

interface QuestionDimension {
  code: string;
  label: string;
  min: number;
  max: number;
}

interface AssessmentQuestion {
  code: string;
  text: string;
  type: 'SINGLE_CHOICE' | 'MULTI_CHOICE' | 'SLIDER' | 'RATING' | 'MULTI_SLIDER';
  required: boolean;
  options?: QuestionOption[];
  dimensions?: QuestionDimension[];
  min?: number;
  max?: number;
  step?: number;
  answer?: any;
}

interface QuestionRendererProps {
  question: AssessmentQuestion;
  questionNumber?: number;
  value: any;
  onChange: (value: any) => void;
  disabled?: boolean;
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  questionNumber,
  value,
  onChange,
  disabled = false,
}) => {
  const handleSingleChoiceChange = (selectedValue: string) => {
    onChange({ value: selectedValue });
  };

  const handleMultipleChoiceChange = (selectedValues: string[]) => {
    onChange({ values: selectedValues });
  };

  const handleSliderChange = (sliderValue: number) => {
    onChange({ value: sliderValue });
  };

  const handleMultiSliderChange = (dimensionValues: Record<string, number>) => {
    onChange({ values: dimensionValues });
  };

  const handleRatingChange = (ratingValue: string | number) => {
    onChange({ value: ratingValue });
  };

  // Convert API options to component format
  const convertOptions = (options?: QuestionOption[]) => {
    return options?.map(option => ({
      value: option.value,
      label: option.label,
    })) || [];
  };

  // Get current value based on question type
  const getCurrentValue = () => {
    if (!value) return undefined;
    
    switch (question.type) {
      case 'SINGLE_CHOICE':
        return value.value || '';
      case 'MULTI_CHOICE':
        return value.values || [];
      case 'SLIDER':
      case 'RATING':
        return value.value || 0;
      case 'MULTI_SLIDER':
        return value.values || {};
      default:
        return value;
    }
  };

  const currentValue = getCurrentValue();

  switch (question.type) {
    case 'SINGLE_CHOICE':
      return (
        <SingleChoiceQuestion
          question={question.text}
          questionNumber={questionNumber}
          value={currentValue as string}
          onChange={handleSingleChoiceChange}
          options={convertOptions(question.options)}
          disabled={disabled}
        />
      );

    case 'MULTI_CHOICE':
      return (
        <MultipleChoiceQuestion
          question={question.text}
          questionNumber={questionNumber}
          value={currentValue as string[]}
          onChange={handleMultipleChoiceChange}
          options={convertOptions(question.options)}
          disabled={disabled}
        />
      );

    case 'SLIDER':
      return (
        <SliderQuestion
          question={question.text}
          questionNumber={questionNumber}
          value={currentValue as number}
          onChange={handleSliderChange}
          min={question.min || 0}
          max={question.max || 100}
          step={question.step || 1}
          disabled={disabled}
        />
      );

    case 'RATING':
      return (
        <StarRatingQuestion
          question={question.text}
          questionNumber={questionNumber}
          value={currentValue as number}
          onChange={handleRatingChange}
          maxStars={question.max || 5}
          disabled={disabled}
        />
      );

    case 'MULTI_SLIDER':
      // For multi-slider, we'll create individual sliders for each dimension
      return (
        <div className="space-y-6">
          <h3 className="text-green-600 font-medium">
            {questionNumber !== undefined && `${questionNumber}. `}{question.text}
          </h3>
          {question.dimensions?.map((dimension) => (
            <div key={dimension.code} className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {dimension.label}
              </label>
              <SliderQuestion
                question=""
                value={(currentValue as Record<string, number>)?.[dimension.code] || dimension.min}
                onChange={(val) => {
                  const newValues = { ...(currentValue as Record<string, number>), [dimension.code]: val };
                  handleMultiSliderChange(newValues);
                }}
                min={dimension.min}
                max={dimension.max}
                step={1}
                disabled={disabled}
              />
            </div>
          ))}
        </div>
      );

    default:
      return (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-2xl">
          <p className="text-yellow-800">
            Unsupported question type: {question.type}
          </p>
        </div>
      );
  }
};

export default QuestionRenderer;
