import React, { useState, useEffect } from 'react';
import { Button } from '../../../../components/ui/Button';
import { Card, CardContent } from '../../../../components/ui/Card';
import type { QuestionType, CreateQuestionPayload } from '../../../../services/adminApi';
import type { QuestionChoiceItem, QuestionItem } from './QuestionListTable';
import type { AdminSection, QuestionCode } from '../../../../features/question-builder/types';

// Import question editors for different types
import SingleChoiceQuestionEditor from './SingleChoiceQuestionEditor';
import MultipleChoiceQuestionEditor from './MultipleChoiceQuestionEditor';
import SliderQuestionEditor from './SliderQuestionEditor';
import StarRatingQuestionEditor from './StarRatingQuestionEditor';
import NPSQuestionEditor from './NPSQuestionEditor';

interface CreateQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionType: QuestionType | null;
  sectionId: string;
  onCreateQuestion: (payload: CreateQuestionPayload) => void;
  isCreating: boolean;
  createError: string | null;
  maxOrder?: number; // Add max order prop
  sections: AdminSection[];
  questionCodesMap: Record<string, QuestionCode[]>;
  isQuestionCodesLoading?: boolean;
}

const CreateQuestionModal: React.FC<CreateQuestionModalProps> = ({
  isOpen,
  onClose,
  questionType,
  sectionId,
  onCreateQuestion,
  isCreating,
  createError,
  maxOrder = 1,
  sections,
  questionCodesMap,
  isQuestionCodesLoading = false
}) => {
  const [questionData, setQuestionData] = useState<Partial<QuestionItem>>({
    question: '',
    type: questionType?.value || '',
    weight: 1,
    status: 'Active',
    order: maxOrder + 1, // Set default order to next available
    options: {}
  });

  // Get the next available order number
  const getNextOrder = () => {
    return maxOrder + 1;
  };

  // Reset form when question type changes
  useEffect(() => {
    if (questionType) {
      setQuestionData(prev => ({
        ...prev,
        type: questionType.value,
        question: '',
        options: getDefaultOptionsForType(questionType.value)
      }));
    }
  }, [questionType]);

  const slugifyLabel = (value: string): string =>
    value.toLowerCase().trim().replace(/\s+/g, '_');

  const buildDefaultChoice = (label: string): QuestionChoiceItem => ({
    label,
    value: slugifyLabel(label),
    points: '1'
  });

  const normalizeChoiceArray = (
    choices?: Array<QuestionChoiceItem | string>
  ): QuestionChoiceItem[] | undefined => {
    if (!choices) {
      return undefined;
    }

    return choices.map((choice, index) => {
      if (typeof choice === 'string') {
        return buildDefaultChoice(choice || `Option ${index + 1}`);
      }
      return {
        label: choice.label,
        value: choice.value || slugifyLabel(choice.label),
        points: choice.points || '1'
      };
    });
  };

  const getDefaultOptionsForType = (type: string) => {
    switch (type) {
      case 'SINGLE_CHOICE':
        return {
          type: 'single-choice',
          choices: [buildDefaultChoice('Option 1'), buildDefaultChoice('Option 2')]
        };
      case 'MULTI_CHOICE':
        return {
          type: 'multiple-choice',
          choices: [buildDefaultChoice('Option 1'), buildDefaultChoice('Option 2')]
        };
      case 'SLIDER':
        return {
          min: 0,
          max: 100,
          step: 1,
          pointsPerUnit: 1,
          dimensionCode: 'slider',
          dimensionLabel: 'Slider'
        };
      case 'MULTI_SLIDER':
        return {
          dimensions: [{
            code: 'dimension1',
            label: 'Dimension 1',
            min_value: 0,
            max_value: 100,
            points_per_unit: 1,
            weight: 1
          }, {
            code: 'dimension2',
            label: 'Dimension 2',
            min_value: 0,
            max_value: 100,
            points_per_unit: 1,
            weight: 1
          }]
        };
      case 'RATING':
        return {
          maxStars: 5,
          labels: ['1', '2', '3', '4', '5']
        };
      case 'NPS':
        return {
          maxStars: 5, // Fixed to 5 for NPS
          labels: ['Not at all likely', 'Slightly likely', 'Somewhat likely', 'Very likely', 'Extremely likely']
        };
      default:
        return {};
    }
  };

  const handleSave = (updatedQuestion: QuestionItem) => {
    // Convert QuestionItem to CreateQuestionPayload
    // Convert sectionId to number for backend (section ID must be a number)
    const numericSectionId = typeof sectionId === 'string' 
      ? (sectionId ? parseInt(sectionId, 10) : 0)
      : (sectionId || 0);
    
    if (!numericSectionId || isNaN(numericSectionId)) {
      console.error('Invalid section ID:', sectionId);
      // Could show an error to user here if needed
    }
    
    const payload: CreateQuestionPayload = {
      section: numericSectionId,
      code: `Q_${Date.now()}`, // Generate unique code
      text: updatedQuestion.question,
      type: updatedQuestion.type as any,
      required: true,
      order: updatedQuestion.order,
      weight: updatedQuestion.weight.toString(),
    };

    // Add type-specific fields
    if (updatedQuestion.type === 'SINGLE_CHOICE' || updatedQuestion.type === 'MULTI_CHOICE') {
      payload.options = updatedQuestion.options?.choices?.map((choice, index: number) => {
        const label = typeof choice === 'string' ? choice : choice.label;
        const value = typeof choice === 'string'
          ? slugifyLabel(choice).toUpperCase()
          : (choice.value || slugifyLabel(choice.label)).toUpperCase();
        const defaultPoints = updatedQuestion.type === 'SINGLE_CHOICE'
          ? Math.max(1, 5 - index).toString()
          : '1';

        return {
          label,
          value,
          points: typeof choice === 'string' ? defaultPoints : (choice.points || defaultPoints),
        };
      }) || [];
    } else if (updatedQuestion.type === 'SLIDER') {
      payload.dimensions = [{
        code: updatedQuestion.options?.dimensionCode || 'slider',
        label: updatedQuestion.options?.dimensionLabel || 'Slider',
        min_value: updatedQuestion.options?.min || 0,
        max_value: updatedQuestion.options?.max || 100,
        points_per_unit: updatedQuestion.options?.pointsPerUnit || 1,
        weight: updatedQuestion.weight
      }];
    } else if (updatedQuestion.type === 'MULTI_SLIDER') {
      payload.dimensions = updatedQuestion.options?.dimensions || [
        { code: 'dimension1', label: 'Dimension 1', min_value: 0, max_value: 100, points_per_unit: 1, weight: 1 },
        { code: 'dimension2', label: 'Dimension 2', min_value: 0, max_value: 100, points_per_unit: 1, weight: 1 }
      ];
    } else if (updatedQuestion.type === 'RATING') {
      console.log('CreateQuestionModal - Handling RATING question');
      console.log('CreateQuestionModal - updatedQuestion options:', updatedQuestion.options);
      console.log('CreateQuestionModal - labels:', updatedQuestion.options?.labels);
      console.log('CreateQuestionModal - maxStars:', updatedQuestion.options?.maxStars);
      
      payload.options = Array.from({ length: updatedQuestion.options?.maxStars || 5 }, (_, i) => ({
        label: updatedQuestion.options?.labels?.[i] || `${i + 1}`,
        value: (i + 1).toString(),
        points: '1'
      }));
      
      console.log('CreateQuestionModal - RATING options payload:', payload.options);
    } else if (updatedQuestion.type === 'NPS') {
      console.log('CreateQuestionModal - Handling NPS question');
      console.log('CreateQuestionModal - updatedQuestion options:', updatedQuestion.options);
      console.log('CreateQuestionModal - labels:', updatedQuestion.options?.labels);
      console.log('CreateQuestionModal - maxStars:', updatedQuestion.options?.maxStars);
      
      // NPS is fixed to 5 options like star ratings
      payload.options = Array.from({ length: updatedQuestion.options?.maxStars || 5 }, (_, i) => ({
        label: updatedQuestion.options?.labels?.[i] || ['Not at all likely', 'Slightly likely', 'Somewhat likely', 'Very likely', 'Extremely likely'][i],
        value: i.toString(),
        points: '1'
      }));
      
      console.log('CreateQuestionModal - NPS options payload:', payload.options);
    }

    console.log('CreateQuestionModal - Final payload:', payload);
    onCreateQuestion(payload);
  };

  const handleCancel = () => {
    setQuestionData({
      question: '',
      type: questionType?.value || '',
      weight: 1,
      status: 'Active',
      order: 1,
      options: {}
    });
    onClose();
  };

  if (!isOpen || !questionType) {
    return null;
  }

  const renderQuestionEditor = () => {
    const questionItem: QuestionItem = {
      id: 0, // Temporary ID for new questions
      order: questionData.order || 1,
      question: questionData.question || '',
      type: questionData.type || questionType.value,
      weight: questionData.weight || 1,
      status: questionData.status || 'Active',
      options: questionData.options
        ? {
            ...questionData.options,
            ...(questionData.options?.choices
              ? { choices: normalizeChoiceArray(questionData.options.choices) }
              : {}),
          }
        : {}
    };

    switch (questionType.value) {
      case 'SINGLE_CHOICE':
        return (
          <SingleChoiceQuestionEditor
            question={questionItem}
            onSave={handleSave}
            onCancel={handleCancel}
            isLoading={isCreating}
            sections={sections}
            questionCodesMap={questionCodesMap}
            isQuestionCodesLoading={isQuestionCodesLoading}
          />
        );
      case 'MULTI_CHOICE':
        return (
          <MultipleChoiceQuestionEditor
            question={questionItem}
            onSave={handleSave}
            onCancel={handleCancel}
            isLoading={isCreating}
            sections={sections}
            questionCodesMap={questionCodesMap}
            isQuestionCodesLoading={isQuestionCodesLoading}
          />
        );
      case 'SLIDER':
      case 'MULTI_SLIDER':
        return (
          <SliderQuestionEditor
            question={questionItem}
            onSave={handleSave}
            onCancel={handleCancel}
            isLoading={isCreating}
          />
        );
      case 'RATING':
        return (
          <StarRatingQuestionEditor
            question={questionItem}
            onSave={handleSave}
            onCancel={handleCancel}
            isLoading={isCreating}
          />
        );
      case 'NPS':
        // NPS uses NPSQuestionEditor with fixed 5 options and emojis
        return (
          <NPSQuestionEditor
            question={questionItem}
            onSave={handleSave}
            onCancel={handleCancel}
            isLoading={isCreating}
          />
        );
      default:
        return (
          <Card className="p-6">
            <CardContent className="p-0">
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">Question type "{questionType.label}" not supported yet!</p>
                <div className="flex justify-center space-x-3">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      {/* Blurred backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      
      <div className="relative bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h2 
                className="text-2xl font-semibold text-gray-800"
                style={{
                  fontFamily: 'Baskervville',
                  fontWeight: 600,
                  fontStyle: 'normal',
                  fontSize: '24px'
                }}
              >
                Create {questionType.label} Question
              </h2>
              
              {/* Order Input */}
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
                  value={questionData.order || getNextOrder()}
                  onChange={(e) => setQuestionData(prev => ({ 
                    ...prev, 
                    order: parseInt(e.target.value) || getNextOrder() 
                  }))}
                  className="w-20 p-2 border border-gray-200 rounded focus:border-green-500 focus:outline-none text-center"
                  min="1"
                />
              </div>
            </div>
            
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {createError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{createError}</p>
            </div>
          )}

          {renderQuestionEditor()}
        </div>
      </div>
    </div>
  );
};

export default CreateQuestionModal;
