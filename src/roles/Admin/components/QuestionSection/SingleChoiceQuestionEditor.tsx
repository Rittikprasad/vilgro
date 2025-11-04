import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '../../../../components/ui/Button';
import { Card, CardContent } from '../../../../components/ui/Card';
import type { QuestionItem } from './QuestionListTable';
import type { RootState } from '../../../../app/store';
import { fetchQuestionCodesBySection } from '../../../../features/question-builder/questionBuilderSlice';
import ACBIcon from '../../../../assets/svg/ACB.svg';

interface QuestionOption {
  id: string;
  text: string;
  score: number;
  conditionalBranching?: {
    goTo: string; // "Question" or "Return"
    questionId?: string | number;
    score?: number;
  };
}

interface SingleChoiceQuestionEditorProps {
  question: QuestionItem;
  onSave: (updatedQuestion: QuestionItem) => void;
  onCancel: () => void;
  onDelete?: (questionId: number) => void;
  isLoading?: boolean;
}

const SingleChoiceQuestionEditor: React.FC<SingleChoiceQuestionEditorProps> = ({
  question,
  onSave,
  onCancel,
  onDelete,
  isLoading = false
}) => {
  // Get sections and questionCodes from Redux store
  const { sections, questionCodes, questionCodesLoading } = useSelector((state: RootState) => state.questionBuilder);
  const dispatch = useDispatch();
  
  const [questionText, setQuestionText] = useState(question.question);
  const [options, setOptions] = useState<QuestionOption[]>(
    question.options?.choices?.map((choice: string, index: number) => ({
      id: `option_${index}`,
      text: choice,
      score: 4 - index, // Default scores: 4, 3, 2, 1
      conditionalBranching: {
        goTo: "Return",
        questionId: undefined,
        score: 0
      }
    })) || []
  );
  const [weightage, setWeightage] = useState(question.weight);
  const [order, setOrder] = useState(question.order);
  const [isActive, setIsActive] = useState(question.status === 'Active');
  const [showConditionalBranching, setShowConditionalBranching] = useState(false);

  const handleAddOption = () => {
    const newOption: QuestionOption = {
      id: `option_${Date.now()}`,
      text: '',
      score: 1,
      conditionalBranching: {
        goTo: "Return",
        questionId: undefined,
        score: 0
      }
    };
    setOptions([...options, newOption]);
  };

  const handleConditionalBranchingToggle = () => {
    setShowConditionalBranching(!showConditionalBranching);
  };

  const handleGoToChange = (optionId: string, goTo: string) => {
    setOptions(options.map(option => 
      option.id === optionId ? { 
        ...option, 
        conditionalBranching: { 
          goTo,
          questionId: option.conditionalBranching?.questionId,
          score: option.conditionalBranching?.score || 0
        }
      } : option
    ));
    
    // Fetch question codes when section is selected
    if (goTo) {
      dispatch(fetchQuestionCodesBySection(goTo) as any);
    }
  };

  const handleQuestionChange = (optionId: string, questionId: string | number) => {
    setOptions(options.map(option => 
      option.id === optionId ? { 
        ...option, 
        conditionalBranching: { 
          goTo: option.conditionalBranching?.goTo || "Return",
          questionId,
          score: option.conditionalBranching?.score || 0
        }
      } : option
    ));
  };

  const handleConditionalScoreChange = (optionId: string, score: number) => {
    setOptions(options.map(option => 
      option.id === optionId ? { 
        ...option, 
        conditionalBranching: { 
          goTo: option.conditionalBranching?.goTo || "Return",
          questionId: option.conditionalBranching?.questionId,
          score 
        }
      } : option
    ));
  };

  const handleDeleteOption = (optionId: string) => {
    setOptions(options.filter(option => option.id !== optionId));
  };

  const handleOptionTextChange = (optionId: string, text: string) => {
    setOptions(options.map(option => 
      option.id === optionId ? { ...option, text } : option
    ));
  };

  const handleOptionScoreChange = (optionId: string, score: number) => {
    setOptions(options.map(option => 
      option.id === optionId ? { ...option, score } : option
    ));
  };

  const handleSave = () => {
    // Build conditions array from conditional branching selections
    // Convert option text to value format (lowercase with underscores)
    const conditions = options
      .filter(option => 
        option.conditionalBranching?.questionId && 
        option.conditionalBranching?.goTo !== "Return"
      )
      .map(option => ({
        logic: {
          q: String(option.conditionalBranching?.questionId || ""),
          op: "",
          val: option.text.toLowerCase().replace(/\s+/g, '_') // Convert label to value format
        }
      }));

    const updatedQuestion: QuestionItem = {
      ...question,
      question: questionText,
      weight: weightage,
      order: order,
      status: isActive ? 'Active' : 'Inactive',
      options: {
        type: 'single-choice',
        choices: options.map(option => option.text)
      },
      conditions: conditions.length > 0 ? conditions : undefined
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

        {/* Options */}
        <div className="space-y-4 mb-6">
          {options.map((option, index) => (
            <div key={option.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              {/* Radio button indicator */}
              <div className="w-4 h-4 border-2 border-gray-300 rounded-full flex-shrink-0"></div>
              
              {/* Option text input */}
              <input
                type="text"
                value={option.text}
                onChange={(e) => handleOptionTextChange(option.id, e.target.value)}
                className="flex-1 p-2 border border-gray-200 rounded focus:border-green-500 focus:outline-none"
                placeholder={`Option ${index + 1}...`}
              />
              
              {/* Conditional Branching Controls */}
              {showConditionalBranching && (
                <>
                  <span className="text-sm text-gray-700">Go to</span>
                  <select
                    value={option.conditionalBranching?.goTo || ""}
                    onChange={(e) => handleGoToChange(option.id, e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded focus:border-green-500 focus:outline-none text-sm"
                  >
                    <option value="">Select Section</option>
                    {sections.map((section) => (
                      <option key={section.id} value={section.code}>
                        {section.code}
                      </option>
                    ))}
                  </select>

                  <span className="text-sm text-gray-700">Question</span>
                  <select
                    value={option.conditionalBranching?.questionId || ""}
                    onChange={(e) => handleQuestionChange(option.id, e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded focus:border-green-500 focus:outline-none text-sm"
                    disabled={questionCodesLoading}
                  >
                    <option value="">Select Question</option>
                    {questionCodes.map((question) => (
                      <option key={question.code} value={question.code}>
                        {question.code}
                      </option>
                    ))}
                  </select>
                </>
              )}
              
              {/* Delete option button */}
              <button
                onClick={() => handleDeleteOption(option.id)}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {/* Add Score button and input */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  Add Score
                </Button>
                <input
                  type="number"
                  value={option.score}
                  onChange={(e) => handleOptionScoreChange(option.id, parseInt(e.target.value) || 0)}
                  className="w-16 p-2 border border-gray-200 rounded focus:border-green-500 focus:outline-none text-center"
                  min="0"
                  max="10"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Add Option */}
        <div className="mb-6">
          <button
            onClick={handleAddOption}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 p-3 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 w-full"
          >
            <div className="w-4 h-4 border-2 border-gray-300 rounded-full flex-shrink-0"></div>
            <span>Add another option</span>
          </button>
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
            <button
              className="flex items-center space-x-2 text-green-500 hover:text-green-600 transition-colors"
              onClick={handleConditionalBranchingToggle}
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
                {showConditionalBranching ? 'Hide Conditional Branching' : 'Add Conditional Branching'}
              </span>
            </button>
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

export default SingleChoiceQuestionEditor;
