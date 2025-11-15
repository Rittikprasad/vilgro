import React, { useState } from 'react';
import { Button } from '../../../../components/ui/Button';
import { Card, CardContent } from '../../../../components/ui/Card';
import type { QuestionItem } from './QuestionListTable';

interface StarRatingQuestionEditorProps {
  question: QuestionItem;
  onSave: (updatedQuestion: QuestionItem) => void;
  onCancel: () => void;
  onDelete?: (questionId: number) => void;
  isLoading?: boolean;
}

const StarRatingQuestionEditor: React.FC<StarRatingQuestionEditorProps> = ({
  question,
  onSave,
  onCancel,
  onDelete,
  isLoading = false
}) => {
  const [questionText, setQuestionText] = useState(question.question);
  // Minimum 3 stars, default to 5 if not set
  const [maxStars, setMaxStars] = useState(Math.max(question.options?.maxStars || 5, 3));
  
  // Initialize labels - ensure we have exactly maxStars labels, using empty strings for missing ones
  const initializeLabels = (): string[] => {
    const existingLabels = question.options?.labels || [];
    const labelsArray: string[] = [];
    const currentMaxStars = Math.max(question.options?.maxStars || 5, 3);
    for (let i = 0; i < currentMaxStars; i++) {
      labelsArray[i] = existingLabels[i] !== undefined ? existingLabels[i] : '';
    }
    return labelsArray;
  };
  
  const [labels, setLabels] = useState<string[]>(initializeLabels());
  const [weightage, setWeightage] = useState(question.weight);
  const [order, setOrder] = useState(question.order);
  const [isActive, setIsActive] = useState(question.status === 'Active');

  // Update labels when maxStars changes
  const handleMaxStarsChange = (newMaxStars: number) => {
    // Ensure minimum is 3
    const validatedMaxStars = Math.max(3, Math.min(10, newMaxStars));
    setMaxStars(validatedMaxStars);
    
    // Adjust labels array to match new maxStars - don't add default values
    const newLabels = [...labels];
    if (validatedMaxStars > labels.length) {
      // Add empty strings for new labels
      for (let i = labels.length; i < validatedMaxStars; i++) {
        newLabels.push('');
      }
    } else if (validatedMaxStars < labels.length) {
      // Remove excess labels
      newLabels.splice(validatedMaxStars);
    }
    setLabels(newLabels);
  };

  // Update individual label
  const handleLabelChange = (index: number, value: string) => {
    const newLabels = [...labels];
    newLabels[index] = value;
    setLabels(newLabels);
  };

  const handleSave = () => {
    const updatedQuestion: QuestionItem = {
      ...question,
      question: questionText,
      weight: weightage,
      order: order,
      status: isActive ? 'Active' : 'Inactive',
      options: {
        maxStars: maxStars,
        labels: labels.slice(0, maxStars) // Ensure labels match maxStars
      }
    };
    onSave(updatedQuestion);
  };

  return (
    <Card className="p-6">
      <CardContent className="p-0">
        {/* Question Text Input */}
        <div className="mb-6">
          <label 
            className="block text-sm font-medium text-gray-700 mb-2"
            style={{
              fontFamily: 'Golos Text',
              fontWeight: 400,
              fontStyle: 'normal',
              fontSize: '14px'
            }}
          >
            Question Text *
          </label>
          <textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            rows={3}
            className="w-full p-3 border-b-2 border-gray-200 focus:border-green-500 focus:outline-none bg-gray-50 rounded-t-lg"
            placeholder="Enter question text..."
          />
        </div>

        {/* Star Rating Configuration */}
        <div className="space-y-4 mb-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 
              className="text-sm font-medium text-gray-700 mb-4"
              style={{
                fontFamily: 'Golos Text',
                fontWeight: 500,
                fontStyle: 'normal',
                fontSize: '14px'
              }}
            >
              Star Rating Configuration
            </h4>
            
            <div className="space-y-4">
              {/* Maximum Stars */}
              <div>
                <label 
                  className="block text-sm font-medium text-gray-600 mb-2"
                  style={{
                    fontFamily: 'Golos Text',
                    fontWeight: 400,
                    fontStyle: 'normal',
                    fontSize: '12px'
                  }}
                >
                  Maximum Stars
                </label>
                <input
                  type="number"
                  value={maxStars}
                  onChange={(e) => handleMaxStarsChange(parseInt(e.target.value) || 3)}
                  className="w-20 p-2 border border-gray-200 rounded focus:border-green-500 focus:outline-none text-center"
                  min="3"
                  max="5"
                />
              </div>

              {/* Star Labels */}
              <div>
                <label 
                  className="block text-sm font-medium text-gray-600 mb-2"
                  style={{
                    fontFamily: 'Golos Text',
                    fontWeight: 400,
                    fontStyle: 'normal',
                    fontSize: '12px'
                  }}
                >
                  Star Labels
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Array.from({ length: maxStars }, (_, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500 w-8">⭐ {index + 1}:</span>
                      <input
                        type="text"
                        value={labels[index] !== undefined ? labels[index] : ''}
                        onChange={(e) => handleLabelChange(index, e.target.value)}
                        className="flex-1 p-2 border border-gray-200 rounded focus:border-green-500 focus:outline-none"
                        placeholder={`Label ${index + 1} (optional)`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="mb-6" />

        {/* Bottom Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Order */}
            <div className="flex items-center space-x-2">
              <label 
                className="text-sm font-medium text-gray-700"
                style={{
                  fontFamily: 'Golos Text',
                  fontWeight: 400,
                  fontStyle: 'normal',
                  fontSize: '14px'
                }}
              >
                Order:
              </label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value) || 1)}
                className="w-16 p-2 border border-gray-200 rounded focus:border-green-500 focus:outline-none text-center"
                min="1"
              />
            </div>

            {/* Weightage */}
            <div className="flex items-center space-x-2">
              <label 
                className="text-sm font-medium text-gray-700"
                style={{
                  fontFamily: 'Golos Text',
                  fontWeight: 400,
                  fontStyle: 'normal',
                  fontSize: '14px'
                }}
              >
                Weightage:
              </label>
              <input
                type="number"
                value={weightage}
                onChange={(e) => setWeightage(parseInt(e.target.value) || 1)}
                className="w-16 p-2 border border-gray-200 rounded focus:border-green-500 focus:outline-none text-center"
                min="1"
                max="10"
              />
            </div>

            {/* Conditional Branching */}
            {/* <button
              className="flex items-center space-x-2 text-green-500 hover:text-green-600 transition-colors"
            >
              <img src={ACBIcon} alt="Conditional Branching" className="w-4 h-4" />
              <span 
                className="text-sm font-medium underline"
                style={{
                  fontFamily: 'Golos Text',
                  fontWeight: 400,
                  fontStyle: 'normal',
                  fontSize: '14px'
                }}
              >
                Add Conditional Branching
              </span>
            </button> */}
          </div>

          <div className="flex items-center space-x-4">
            {/* Active Toggle */}
            <div className="flex items-center space-x-2">
              <label 
                className="text-sm font-medium text-gray-700"
                style={{
                  fontFamily: 'Golos Text',
                  fontWeight: 400,
                  fontStyle: 'normal',
                  fontSize: '14px'
                }}
              >
                Active:
              </label>
              <button
                onClick={() => setIsActive(!isActive)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isActive ? 'bg-green-500' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isActive ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Delete Question */}
            <button 
              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(question.id);
              }}
              disabled={!onDelete || isLoading}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Save/Cancel Buttons */}
        <div className="flex justify-end space-x-3 mt-6">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="gradient"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StarRatingQuestionEditor;
