import React, { useState } from 'react';
import { Button } from '../../../../components/ui/Button';
import { Card, CardContent } from '../../../../components/ui/Card';
import type { QuestionItem } from './QuestionListTable';

interface SliderQuestionEditorProps {
  question: QuestionItem;
  onSave: (updatedQuestion: QuestionItem) => void;
  onCancel: () => void;
}

const SliderQuestionEditor: React.FC<SliderQuestionEditorProps> = ({
  question,
  onSave,
  onCancel
}) => {
  const [questionText, setQuestionText] = useState(question.question);
  const [minValue, setMinValue] = useState(question.options?.min || 0);
  const [maxValue, setMaxValue] = useState(question.options?.max || 100);
  const [stepValue, setStepValue] = useState(question.options?.step || 1);
  const [pointsPerUnit, setPointsPerUnit] = useState(question.options?.pointsPerUnit || 1);
  const [weightage, setWeightage] = useState(question.weight);
  const [isActive, setIsActive] = useState(question.status === 'Active');

  const handleSave = () => {
    const updatedQuestion: QuestionItem = {
      ...question,
      question: questionText,
      weight: weightage,
      status: isActive ? 'Active' : 'Inactive',
      options: {
        min: minValue,
        max: maxValue,
        step: stepValue,
        pointsPerUnit: pointsPerUnit
      }
    };
    onSave(updatedQuestion);
  };

  return (
    <Card className="p-6">
      <CardContent className="p-0">
        {/* Question Text Input */}
        <div className="mb-6">
          <input
            type="text"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            className="w-full p-3 border-b-2 border-gray-200 focus:border-green-500 focus:outline-none bg-gray-50 rounded-t-lg"
            placeholder="Enter question text..."
          />
        </div>

        {/* Slider Configuration */}
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
              Slider Configuration
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Minimum Value */}
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
                  Minimum Value
                </label>
                <input
                  type="number"
                  value={minValue}
                  onChange={(e) => setMinValue(parseInt(e.target.value) || 0)}
                  className="w-full p-2 border border-gray-200 rounded focus:border-green-500 focus:outline-none"
                />
              </div>

              {/* Maximum Value */}
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
                  Maximum Value
                </label>
                <input
                  type="number"
                  value={maxValue}
                  onChange={(e) => setMaxValue(parseInt(e.target.value) || 100)}
                  className="w-full p-2 border border-gray-200 rounded focus:border-green-500 focus:outline-none"
                />
              </div>

              {/* Step Value */}
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
                  Step Value
                </label>
                <input
                  type="number"
                  value={stepValue}
                  onChange={(e) => setStepValue(parseInt(e.target.value) || 1)}
                  className="w-full p-2 border border-gray-200 rounded focus:border-green-500 focus:outline-none"
                  min="1"
                />
              </div>

              {/* Points Per Unit */}
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
                  Points Per Unit
                </label>
                <input
                  type="number"
                  value={pointsPerUnit}
                  onChange={(e) => setPointsPerUnit(parseInt(e.target.value) || 1)}
                  className="w-full p-2 border border-gray-200 rounded focus:border-green-500 focus:outline-none"
                  min="1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="mb-6" />

        {/* Bottom Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
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
            <Button
              variant="outline"
              size="sm"
              className="flex items-center space-x-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>Add Conditional Branching</span>
            </Button>
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
            <button className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded">
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
          >
            Cancel
          </Button>
          <Button
            variant="gradient"
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SliderQuestionEditor;
