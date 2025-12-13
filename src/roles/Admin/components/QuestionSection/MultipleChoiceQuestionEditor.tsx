import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '../../../../components/ui/Button';
import { Card, CardContent } from '../../../../components/ui/Card';
import type { QuestionChoiceItem, QuestionConditionItem, QuestionItem } from './QuestionListTable';
import type { AdminSection, QuestionCode } from '../../../../features/question-builder/types';
import ACBIcon from '../../../../assets/svg/ACB.svg';

const slugifyLabel = (value: string): string =>
  value.toLowerCase().trim().replace(/\s+/g, '_');

const normalizeChoice = (choice: QuestionChoiceItem | string) => {
  if (typeof choice === 'string') {
    return {
      label: choice,
      value: slugifyLabel(choice),
      points: undefined,
      score: 1,
    };
  }

  return {
    label: choice.label,
    value: choice.value || slugifyLabel(choice.label),
    points: choice.points,
    score: choice.points !== undefined && choice.points !== null 
      ? (isNaN(parseFloat(choice.points)) ? 1 : parseFloat(choice.points))
      : 1,
  };
};

interface QuestionOption {
  id: string;
  text: string;
  value: string;
  score: number;
  conditionalBranching?: {
    goTo?: string;
    questionId?: string | number;
    score?: number;
  };
}

interface MultipleChoiceQuestionEditorProps {
  question: QuestionItem;
  onSave: (updatedQuestion: QuestionItem) => void;
  onCancel: () => void;
  onDelete?: (questionId: number) => void;
  isLoading?: boolean;
  sections: AdminSection[];
  questionCodesMap: Record<string, QuestionCode[]>;
  isQuestionCodesLoading?: boolean;
}

const MultipleChoiceQuestionEditor: React.FC<MultipleChoiceQuestionEditorProps> = ({
  question,
  onSave,
  onCancel,
  onDelete,
  isLoading = false,
  sections,
  questionCodesMap,
  isQuestionCodesLoading = false,
}) => {
  const [questionText, setQuestionText] = useState(question.question);
  const [weightage, setWeightage] = useState(question.weight);
  const [order, setOrder] = useState(question.order);
  const [isActive, setIsActive] = useState(question.status === 'Active');
  const [showConditionalBranching, setShowConditionalBranching] = useState(
    (question.conditions?.length || 0) > 0
  );

  const buildOptionsFromQuestion = (): QuestionOption[] => {
    const baseChoices = question.options?.choices || [];

    return baseChoices.map((choice: QuestionChoiceItem | string, index: number) => {
      const normalized = normalizeChoice(choice);
      const existingCondition = question.conditions?.find(
        (condition: QuestionConditionItem) => condition.expectedValue === normalized.value
      );

      return {
        id: `option_${index}_${question.id}`,
        text: normalized.label,
        value: normalized.value,
        score: normalized.score,
        conditionalBranching: {
          goTo: existingCondition?.sectionCode || '',
          questionId: existingCondition?.questionCode,
          score: 0,
        },
      };
    });
  };

  const [options, setOptions] = useState<QuestionOption[]>(buildOptionsFromQuestion);

  useEffect(() => {
    setOptions(buildOptionsFromQuestion());
    setQuestionText(question.question);
    setWeightage(question.weight);
    setOrder(question.order);
    setIsActive(question.status === 'Active');
    setShowConditionalBranching((question.conditions?.length || 0) > 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]);

  const questionCodeToSection = useMemo(() => {
    const map: Record<string, string> = {};
    Object.entries(questionCodesMap).forEach(([sectionCode, codes]) => {
      codes.forEach((code) => {
        map[code.code] = sectionCode;
      });
    });
    return map;
  }, [questionCodesMap]);

  useEffect(() => {
    if (!question.conditions || question.conditions.length === 0) {
      return;
    }

    setOptions((currentOptions) =>
      currentOptions.map((option) => {
        if (option.conditionalBranching?.goTo) {
          return option;
        }

        const matchedCondition = question.conditions?.find(
          (condition) => condition.expectedValue === option.value
        );

        if (!matchedCondition) {
          return option;
        }

        const inferredSection =
          matchedCondition.sectionCode || questionCodeToSection[matchedCondition.questionCode];

        if (!inferredSection) {
          return option;
        }

        return {
          ...option,
          conditionalBranching: {
            ...option.conditionalBranching,
            goTo: inferredSection,
            questionId: matchedCondition.questionCode,
          },
        };
      })
    );
  }, [question.conditions, questionCodeToSection]);

  const handleAddOption = () => {
    const nextIndex = options.length + 1;
    const defaultLabel = `Option ${nextIndex}`;
    const newOption: QuestionOption = {
      id: `option_${Date.now()}`,
      text: defaultLabel,
      value: slugifyLabel(`${defaultLabel}_${Date.now()}`),
      score: 1,
      conditionalBranching: {
        goTo: '',
        questionId: undefined,
        score: 0,
      },
    };
    setOptions((prev) => [...prev, newOption]);
  };

  const handleConditionalBranchingToggle = () => {
    setShowConditionalBranching((prev) => !prev);
  };

  const handleGoToChange = (optionId: string, sectionCode: string) => {
    setOptions((prevOptions) =>
      prevOptions.map((option) =>
        option.id === optionId
          ? {
              ...option,
              conditionalBranching: {
                goTo: sectionCode,
                questionId: sectionCode ? option.conditionalBranching?.questionId : undefined,
                score: option.conditionalBranching?.score || 0,
              },
            }
          : option
      )
    );
  };

  const handleQuestionChange = (optionId: string, questionId: string | number) => {
    setOptions((prevOptions) =>
      prevOptions.map((option) =>
        option.id === optionId
          ? {
              ...option,
              conditionalBranching: {
                ...option.conditionalBranching,
                questionId,
              },
            }
          : option
      )
    );
  };

  const handleDeleteOption = (optionId: string) => {
    setOptions((prevOptions) => prevOptions.filter((option) => option.id !== optionId));
  };

  const handleOptionTextChange = (optionId: string, text: string) => {
    setOptions((prevOptions) =>
      prevOptions.map((option) =>
        option.id === optionId ? { ...option, text, value: slugifyLabel(text || option.id) } : option
      )
    );
  };

  const handleOptionScoreChange = (optionId: string, score: number) => {
    setOptions((prevOptions) =>
      prevOptions.map((option) => (option.id === optionId ? { ...option, score } : option))
    );
  };

  const buildConditionsPayload = (): QuestionConditionItem[] | undefined => {
    const nextConditions = options
      .filter(
        (option) => option.conditionalBranching?.questionId && option.conditionalBranching?.goTo
      )
      .map((option) => ({
        questionCode: String(option.conditionalBranching?.questionId),
        expectedValue: option.value,
        sectionCode: option.conditionalBranching?.goTo || undefined,
      }));

    return nextConditions.length > 0 ? nextConditions : undefined;
  };

  const handleSave = () => {
    const updatedQuestion: QuestionItem = {
      ...question,
      question: questionText,
      weight: weightage,
      order: order,
      status: isActive ? 'Active' : 'Inactive',
      options: {
        type: 'multiple-choice',
        choices: options.map((option) => ({
          label: option.text,
          value: option.value,
          points: option.score.toString(),
        })),
      },
      conditions: buildConditionsPayload(),
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
            <div key={option.id} className="flex flex-wrap items-center gap-2 p-3 bg-gray-50 rounded-lg">
              {/* Checkbox indicator */}
              <div className="w-4 h-4 border-2 border-gray-300 rounded flex-shrink-0 flex items-center justify-center">
                {/* Empty checkbox - will be filled when selected */}
                <div className="w-2 h-2 bg-transparent rounded-sm"></div>
              </div>
              
              {/* Option text input */}
              <input
                type="text"
                value={option.text}
                onChange={(e) => handleOptionTextChange(option.id, e.target.value)}
                className="flex-1 min-w-[150px] p-2 border border-gray-200 rounded focus:border-green-500 focus:outline-none"
                placeholder={`Option ${index + 1}...`}
              />
              
              {/* Conditional Branching Controls */}
              {showConditionalBranching && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-gray-700 whitespace-nowrap">Go to</span>
                  <select
                    value={option.conditionalBranching?.goTo || ''}
                    onChange={(e) => handleGoToChange(option.id, e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded focus:border-green-500 focus:outline-none text-sm flex-shrink-0"
                  >
                    <option value="">Select Section</option>
                    {sections.map((section) => (
                      <option key={section.id} value={section.code}>
                        {section.code}
                      </option>
                    ))}
                  </select>

                  <span className="text-sm text-gray-700 whitespace-nowrap">Question</span>
                  <select
                    value={option.conditionalBranching?.questionId || ''}
                    onChange={(e) => handleQuestionChange(option.id, e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded focus:border-green-500 focus:outline-none text-sm max-w-[300px] min-w-[200px] flex-shrink-0"
                    disabled={
                      isQuestionCodesLoading || !option.conditionalBranching?.goTo
                    }
                  >
                    <option value="">Select Question</option>
                    {(option.conditionalBranching?.goTo
                      ? questionCodesMap[option.conditionalBranching.goTo] || []
                      : []
                    ).map((questionCode) => (
                      <option key={questionCode.code} value={questionCode.code} title={questionCode.text || questionCode.code}>
                        {questionCode.text || questionCode.code}
                      </option>
                    ))}
                  </select>
                </div>
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
            <div className="w-4 h-4 border-2 border-gray-300 rounded flex-shrink-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-transparent rounded-sm"></div>
            </div>
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

export default MultipleChoiceQuestionEditor;
