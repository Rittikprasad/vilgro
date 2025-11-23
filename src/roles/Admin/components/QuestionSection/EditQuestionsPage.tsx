import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '../../../../components/ui/Button';
import { Card, CardContent } from '../../../../components/ui/Card';
import ConfirmationModal from '../../../../components/ui/ConfirmationModal';
import BackIcon from '../../../../assets/svg/BackIcon.svg';
import type { QuestionChoiceItem, QuestionConditionItem, QuestionItem } from './QuestionListTable';
import type { RootState } from '../../../../app/store';
import { getQuestionTypes, createQuestion, clearError } from '../../../../features/assessment/assessmentSlice';
import { updateAdminQuestion, deleteAdminQuestion } from '../../../../features/question-builder/questionBuilderSlice';
import QuestionTypeDropdown from './QuestionTypeDropdown';
import CreateQuestionModal from './CreateQuestionModal';
import type { QuestionType, CreateQuestionPayload } from '../../../../services/adminApi';
import type { QuestionCode } from '../../../../features/question-builder/types';
import api from '../../../../services/api';
import { endpoints } from '../../../../services/endpoints';

// Import custom question components
import SingleChoiceQuestion from '../../../../components/ui/question/SingleChoiceQuestion';
import MultipleChoiceQuestion from '../../../../components/ui/question/MultipleChoiceQuestion';
import SliderQuestion from '../../../../components/ui/question/SliderQuestion';
import StarRatingQuestion from '../../../../components/ui/question/StarRatingQuestion';
import VisualRatingQuestion from '../../../../components/ui/question/VisualRatingQuestion';
import SingleChoiceQuestionEditor from './SingleChoiceQuestionEditor';
import MultipleChoiceQuestionEditor from './MultipleChoiceQuestionEditor';
import SliderQuestionEditor from './SliderQuestionEditor';
import StarRatingQuestionEditor from './StarRatingQuestionEditor';
import NPSQuestionEditor from './NPSQuestionEditor';

interface EditQuestionsPageProps {
  questions: QuestionItem[];
  categoryTitle: string;
  onBackToQuestionList: () => void;
  sectionId: string; // Add sectionId prop for creating questions
}

const slugifyLabel = (value: string): string => value.toLowerCase().replace(/\s+/g, '_');

const getChoiceMeta = (choice: string | QuestionChoiceItem) => {
  if (typeof choice === 'string') {
    const slug = slugifyLabel(choice);
    return {
      label: choice,
      value: slug,
      points: undefined,
    };
  }

  return {
    label: choice.label,
    value: choice.value || slugifyLabel(choice.label),
    points: choice.points,
  };
};

/**
 * EditQuestionsPage Component
 * Displays questions in editable format based on their types
 * This is the fourth level view, showing individual questions for editing
 */
const EditQuestionsPage: React.FC<EditQuestionsPageProps> = ({ 
  questions, 
  categoryTitle,
  onBackToQuestionList,
  sectionId
}) => {
  const dispatch = useDispatch();
  const { 
    questionTypes, 
    questionTypesLoading, 
    isCreatingQuestion,
    createQuestionError
  } = useSelector((state: RootState) => state.assessment);
  const { sections } = useSelector((state: RootState) => state.questionBuilder);

  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
  const [questionCodesMap, setQuestionCodesMap] = useState<Record<string, QuestionCode[]>>({});
  const [questionCodesLoading, setQuestionCodesLoading] = useState(false);
  const hasLoadedQuestionCodesRef = useRef(false);
  
  // Helper to fix RATING questions that were incorrectly converted
  const fixRatingQuestions = (qList: QuestionItem[]): QuestionItem[] => {
    return qList.map(q => {
      // If it's a RATING question but has the wrong options format
      if (q.type === 'RATING' && q.options?.type === 'multiple-choice' && Array.isArray(q.options.choices)) {
        const labels = q.options.choices.map((choice: QuestionChoiceItem | string) =>
          typeof choice === 'string' ? choice : choice.label
        );
        return {
          ...q,
          options: {
            maxStars: labels.length,
            labels
          }
        };
      }
      return q;
    });
  };
  
  const [questionsList, setQuestionsList] = useState<QuestionItem[]>(fixRatingQuestions(questions));

  // Update questionsList when questions prop changes (e.g., after refetch)
  useEffect(() => {
    setQuestionsList(fixRatingQuestions(questions));
  }, [questions]);
  const [selectedQuestionType, setSelectedQuestionType] = useState<QuestionType | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<number | null>(null);

  // Fetch question types on component mount - always fetch to get latest from backend
  useEffect(() => {
    dispatch(getQuestionTypes() as any);
  }, [dispatch]);

  // Preload question codes for all sections so conditional branching can hydrate selections
  useEffect(() => {
    if (!sections || sections.length === 0 || hasLoadedQuestionCodesRef.current) {
      return;
    }

    let isCancelled = false;

    const loadQuestionCodes = async () => {
      setQuestionCodesLoading(true);
      try {
        const entries: Array<[string, QuestionCode[]]> = [];
        for (const section of sections) {
          try {
            const response = await api.get<QuestionCode[]>(endpoints.admin.questionCodes(section.code));
            entries.push([section.code, response.data]);
          } catch (error) {
            console.error(`Failed to fetch question codes for section ${section.code}`, error);
          }
        }

        if (!isCancelled) {
          setQuestionCodesMap((prev) => {
            const next = { ...prev };
            for (const [sectionCode, codes] of entries) {
              next[sectionCode] = codes;
            }
            return next;
          });
          hasLoadedQuestionCodesRef.current = true;
        }
      } catch (error) {
        console.error('Failed to preload question codes', error);
      } finally {
        if (!isCancelled) {
          setQuestionCodesLoading(false);
        }
      }
    };

    void loadQuestionCodes();

    return () => {
      isCancelled = true;
    };
  }, [sections]);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Handle card click to enter edit mode
  const handleCardClick = (questionId: number) => {
    setEditingQuestionId(questionId);
  };

  // Helper function to convert QuestionItem to CreateQuestionPayload format
  const convertQuestionItemToPayload = (question: QuestionItem): Partial<CreateQuestionPayload> => {
    const payload: Partial<CreateQuestionPayload> = {
      section: sectionId,
      text: question.question,
      order: question.order,
      weight: question.weight.toString(),
      required: true, // Default to true, can be made configurable
      is_active: question.status !== 'Inactive',
    };

    // Add type-specific options
    if (question.options) {
      if (question.type === 'single-choice' || (question.type === 'Multi-select' && question.options.type === 'single-choice')) {
        payload.type = 'SINGLE_CHOICE';
        payload.options = (question.options.choices || []).map((choice: QuestionChoiceItem | string, index: number) => {
          const meta = getChoiceMeta(choice);
          const defaultPoints = Math.max(1, 5 - index).toString();
          return {
            label: meta.label,
            value: meta.value.toUpperCase(),
            points: meta.points || defaultPoints,
          };
        });
      } else if (question.type === 'Multi-select' && question.options.type === 'multiple-choice') {
        payload.type = 'MULTI_CHOICE';
        payload.options = (question.options.choices || []).map((choice: QuestionChoiceItem | string) => {
          const meta = getChoiceMeta(choice);
          return {
            label: meta.label,
            value: meta.value.toUpperCase(),
            points: meta.points || '1',
          };
        });
      } else if (question.type === 'Checkbox') {
        payload.type = 'MULTI_CHOICE';
        payload.options = (question.options.choices || []).map((choice: QuestionChoiceItem | string) => {
          const meta = getChoiceMeta(choice);
          return {
            label: meta.label,
            value: meta.value.toUpperCase(),
            points: '1',
          };
        });
      } else if (question.type === 'Slider' || question.type === 'Linear Scale') {
        payload.type = 'SLIDER';
        payload.dimensions = [{
          code: question.options?.dimensionCode || 'slider',
          label: question.options?.dimensionLabel || 'Slider',
          min_value: question.options?.min || 0,
          max_value: question.options?.max || 100,
          points_per_unit: question.options?.pointsPerUnit || 1,
          weight: question.weight,
          step: question.options?.step || 1
        }] as any;
      } else if (question.type === 'Multi-Slider') {
        payload.type = 'MULTI_SLIDER';
        // Map dimensions and ensure step is included in each
        payload.dimensions = (question.options?.dimensions || [
          { code: 'dimension1', label: 'Dimension 1', min_value: 0, max_value: 100, points_per_unit: 1, weight: question.weight },
          { code: 'dimension2', label: 'Dimension 2', min_value: 0, max_value: 100, points_per_unit: 1, weight: question.weight }
        ]).map((dim: any) => ({
          ...dim,
          step: dim.step || 1
        })) as any;
      } else if (question.type === 'RATING') {
        payload.type = 'RATING';
        const maxStars = Math.max(question.options?.maxStars || 5, 3);
        const labels = question.options?.labels || [];
        payload.options = Array.from({ length: maxStars }, (_, i) => ({
          label: labels[i] !== undefined ? labels[i] : `${i + 1}`,
          value: (i + 1).toString(),
          points: '1'
        }));
      } else if (question.type === 'NPS') {
        payload.type = 'NPS';
        // Convert labels to options format (fixed 4 options)
        const defaultLabels = ['Not at all likely', 'Slightly likely', 'Somewhat likely', 'Very likely'];
        const labels = question.options?.labels || [];
        payload.options = Array.from({ length: 4 }, (_, i) => ({
          label: labels[i] !== undefined ? labels[i] : defaultLabels[i],
          value: i.toString(),
          points: '1'
        }));
      } else if (question.type === 'Smiley face') {
        payload.type = 'RATING';
        payload.options = question.options?.options?.map((option: any) => ({
          label: option.label,
          value: option.value.toString(),
          points: '1'
        })) || [];
      }
    }

    // Add conditions if they exist
    if (question.conditions && question.conditions.length > 0) {
      payload.conditions = question.conditions.map((condition: QuestionConditionItem) => ({
        logic: {
          section: condition.sectionCode,
          question: condition.questionCode,
          value: condition.expectedValue,
          if: [
            {
              '==': [
                condition.questionCode,
                condition.expectedValue
              ]
            }
          ],
          then: true
        }
      }));
    }

    console.log('EditQuestionsPage - Final payload:', payload);
    return payload;
  };

  // Handle saving edited question
  const handleSaveQuestion = async (updatedQuestion: QuestionItem) => {
    try {
      setIsUpdating(true);
      
      // Check for order conflicts and handle swapping
      const conflictingQuestion = questionsList.find(q => 
        q.id !== updatedQuestion.id && q.order === updatedQuestion.order
      );
      
      if (conflictingQuestion) {
        // Swap orders: move conflicting question to the old order of updated question
        const originalQuestion = questionsList.find(q => q.id === updatedQuestion.id);
        const oldOrder = originalQuestion?.order || updatedQuestion.order;
        
        // Update the conflicting question's order
        const updatedConflictingQuestion = { ...conflictingQuestion, order: oldOrder };
        
        // Update both questions in the list
        const updatedQuestionsList = questionsList.map(q => {
          if (q.id === updatedQuestion.id) {
            return updatedQuestion;
          } else if (q.id === conflictingQuestion.id) {
            return updatedConflictingQuestion;
          }
          return q;
        });
        
        setQuestionsList(updatedQuestionsList);
        
        // Convert both questions to API payload format and update them
        const updatedQuestionPayload = convertQuestionItemToPayload(updatedQuestion);
        const conflictingQuestionPayload = convertQuestionItemToPayload(updatedConflictingQuestion);
        
        // Update both questions via API
        const updatePromises = [
          dispatch(updateAdminQuestion({ 
            id: updatedQuestion.id,
            data: updatedQuestionPayload 
          }) as any),
          dispatch(updateAdminQuestion({ 
            id: conflictingQuestion.id,
            data: conflictingQuestionPayload 
          }) as any)
        ];
        
        const results = await Promise.all(updatePromises);
        
        // Check if both updates were successful
        const allSuccessful = results.every(result => result.type.endsWith('fulfilled'));
        
        if (allSuccessful) {
          setEditingQuestionId(null);
          console.log('Both questions updated successfully with order swap');
        } else {
          console.error('Failed to update one or both questions:', results);
          // Revert the local state if API calls failed
          setQuestionsList(questionsList);
        }
      } else {
        // No conflict, just update the single question
        const payload = convertQuestionItemToPayload(updatedQuestion);
        
        const result = await dispatch(updateAdminQuestion({ 
          id: updatedQuestion.id,
          data: payload 
        }) as any);
        
        if (result.type.endsWith('fulfilled')) {
          setQuestionsList(questionsList.map(q => 
            q.id === updatedQuestion.id ? updatedQuestion : q
          ));
          setEditingQuestionId(null);
        } else {
          console.error('Failed to update question:', result.payload);
        }
      }
    } catch (error) {
      console.error('Error updating question:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle canceling edit mode
  const handleCancelEdit = () => {
    setEditingQuestionId(null);
  };

  // Handle opening delete modal
  const handleOpenDeleteModal = (questionId: number) => {
    setQuestionToDelete(questionId);
    setShowDeleteModal(true);
  };

  // Handle closing delete modal
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setQuestionToDelete(null);
  };

  // Handle confirming delete
  const handleConfirmDelete = async () => {
    if (!questionToDelete) return;

    try {
      await dispatch(deleteAdminQuestion(questionToDelete) as any);
      
      // Remove the question from the local list
      setQuestionsList(questionsList.filter(q => q.id !== questionToDelete));
      
      // Exit edit mode if the deleted question was being edited
      if (editingQuestionId === questionToDelete) {
        setEditingQuestionId(null);
      }
    } catch (error) {
      console.error('Error deleting question:', error);
    } finally {
      setShowDeleteModal(false);
      setQuestionToDelete(null);
    }
  };

  // Handle question type selection from dropdown
  const handleQuestionTypeSelect = (questionType: QuestionType) => {
    setSelectedQuestionType(questionType);
    setIsCreateModalOpen(true);
  };

  // Handle creating a new question
  const handleCreateQuestion = async (payload: any) => {
    try {
      const result = await dispatch(createQuestion(payload) as any);
      
      // Check if creation was successful
      if (result.type.endsWith('fulfilled')) {
        // Extract the created question data from the result
        const createdQuestion = result.payload;
        
        // Convert API response to QuestionItem format
        if (createdQuestion) {
          console.log('Created question from API:', createdQuestion);
          const options = convertApiOptionsToQuestionOptions(createdQuestion);
          console.log('Converted options:', options);
          
          const newQuestion: QuestionItem = {
            id: parseInt(createdQuestion.id) || Date.now(),
            order: createdQuestion.order || Math.max(...questionsList.map(q => q.order), 0) + 1,
            question: createdQuestion.text,
            type: convertApiTypeToDisplayType(createdQuestion.type),
            weight: parseFloat(createdQuestion.weight) || 1,
            status: createdQuestion.is_active === false ? 'Inactive' : 'Active',
            options: options,
            conditions: convertApiConditionsToQuestionConditions(createdQuestion)
          };
          
          console.log('New question to add:', newQuestion);
          
          // Add the new question to the local list
          setQuestionsList([...questionsList, newQuestion]);
        }
        
        // Close modal on success
        setIsCreateModalOpen(false);
        setSelectedQuestionType(null);
      }
    } catch (error) {
      console.error('Error creating question:', error);
    }
  };

  // Helper function to convert API question type to display type
  const convertApiTypeToDisplayType = (apiType: string): string => {
    switch (apiType) {
      case 'SINGLE_CHOICE': return 'single-choice';
      case 'MULTI_CHOICE': return 'Multi-select';
      case 'SLIDER': return 'Slider';
      case 'MULTI_SLIDER': return 'Multi-Slider';
      case 'RATING': return 'RATING';
      case 'NPS': return 'NPS';
      default: return apiType;
    }
  };

  // Helper function to convert API options to question options
  const convertApiOptionsToQuestionOptions = (question: any): any => {
    console.log('convertApiOptionsToQuestionOptions - question:', question);
    console.log('convertApiOptionsToQuestionOptions - question.type:', question.type);
    
    if (question.options && question.options.length > 0) {
      console.log('convertApiOptionsToQuestionOptions - options found:', question.options);
      
      // For RATING questions, return labels and maxStars (minimum 3)
      if (question.type === 'RATING') {
        const converted = {
          maxStars: Math.max(question.options.length, 3),
          labels: question.options.map((opt: any) => opt.label)
        };
        console.log('convertApiOptionsToQuestionOptions - RATING converted to:', converted);
        return converted;
      }
      
      // For NPS questions, return labels and maxStars (fixed to 4)
      if (question.type === 'NPS') {
        const converted = {
          maxStars: 4,
          labels: question.options.slice(0, 4).map((opt: any) => opt.label)
        };
        console.log('convertApiOptionsToQuestionOptions - NPS converted to:', converted);
        return converted;
      }
      
      // For SINGLE_CHOICE and MULTI_CHOICE, return choices with metadata
      if (question.type === 'SINGLE_CHOICE' || question.type === 'MULTI_CHOICE') {
        return {
          type: question.type === 'SINGLE_CHOICE' ? 'single-choice' : 'multiple-choice',
          choices: question.options.map((opt: any) => ({
            label: opt.label,
            value: opt.value || slugifyLabel(opt.label),
            points: opt.points
          }))
        };
      }
    } else if (question.dimensions && question.dimensions.length > 0) {
      if (question.type === 'MULTI_SLIDER') {
        return {
          dimensions: question.dimensions.map((dim: any) => ({
            code: dim.code,
            label: dim.label,
            min_value: dim.min_value,
            max_value: dim.max_value,
            points_per_unit: dim.points_per_unit,
            weight: dim.weight,
            step: dim.step || 1
          }))
        };
      } else {
        const dim = question.dimensions[0];
        return {
          min: dim.min_value,
          max: dim.max_value,
          step: dim.step || question.step || 1,
          pointsPerUnit: parseFloat(dim.points_per_unit),
          dimensionCode: dim.code,
          dimensionLabel: dim.label
        };
      }
    }
    console.log('convertApiOptionsToQuestionOptions - no options, returning empty object');
    return {};
  };

  const convertApiConditionsToQuestionConditions = (question: any): QuestionConditionItem[] | undefined => {
    if (!question.conditions || question.conditions.length === 0) {
      return undefined;
    }

    const normalized = question.conditions
      .map((condition: any) => {
        const { questionCode, expectedValue, sectionCode } = extractConditionParts(condition.logic);
        if (!questionCode || !expectedValue) {
          return null;
        }

        return {
          id: condition.id,
          questionCode,
          expectedValue,
          sectionCode,
        } as QuestionConditionItem;
      })
      .filter(
        (item: QuestionConditionItem | null): item is QuestionConditionItem => item !== null
      );

    return normalized.length > 0 ? normalized : undefined;
  };

  const extractConditionParts = (logic: Record<string, any> | undefined | null): {
    questionCode?: string;
    expectedValue?: string;
    sectionCode?: string;
  } => {
    if (!logic) {
      return {};
    }

    if (logic.section || logic.section_code) {
      return {
        questionCode: String(logic.question || logic.question_code || logic.q || ''),
        expectedValue: String(logic.value || logic.expectedValue || logic.val || ''),
        sectionCode: String(logic.section || logic.section_code || ''),
      };
    }

    if (logic.if && Array.isArray(logic.if)) {
      const equalsCondition = logic.if.find((entry: Record<string, any>) => entry && entry['==']);
      if (equalsCondition && Array.isArray(equalsCondition['==']) && equalsCondition['=='].length >= 2) {
        return {
          questionCode: String(equalsCondition['=='][0] ?? ''),
          expectedValue: String(equalsCondition['=='][1] ?? ''),
          sectionCode: logic.section || logic.section_code || undefined,
        };
      }
    }

    if (logic.q && logic.val) {
      return {
        questionCode: String(logic.q),
        expectedValue: String(logic.val),
        sectionCode: logic.section || logic.section_code || undefined,
      };
    }

    return {};
  };

  // Handle closing create modal
  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setSelectedQuestionType(null);
  };

  // Render question based on type
  const renderQuestionComponent = (question: QuestionItem) => {
    const commonProps = {
      question: question.question,
      onChange: (answer: any) => {
        console.log(`Answer for question ${question.order}:`, answer);
      }
    };

    switch (question.type) {
      case 'single-choice':
        // Convert choices to {value, label} format
        const singleChoiceOptions = (question.options?.choices || []).map((choice: QuestionChoiceItem | string) => {
          const meta = getChoiceMeta(choice);
          return {
            value: meta.value,
            label: meta.label
          };
        });
        return (
          <SingleChoiceQuestion
            {...commonProps}
            options={singleChoiceOptions}
          />
        );
      case 'Multi-select':
        if (question.options?.type === 'single-choice') {
          const formattedOptions = (question.options?.choices || []).map((choice: QuestionChoiceItem | string) => {
            const meta = getChoiceMeta(choice);
            return {
              value: meta.value,
              label: meta.label
            };
          });
          return (
            <SingleChoiceQuestion
              {...commonProps}
              options={formattedOptions}
            />
          );
        } else if (question.options?.type === 'multiple-choice') {
          const formattedOptions = (question.options?.choices || []).map((choice: QuestionChoiceItem | string) => {
            const meta = getChoiceMeta(choice);
            return {
              value: meta.value,
              label: meta.label
            };
          });
          return (
            <MultipleChoiceQuestion
              {...commonProps}
              options={formattedOptions}
            />
          );
        }
        break;

      case 'Slider':
      case 'Linear Scale':
        return (
          <SliderQuestion
            {...commonProps}
            value={0}
            min={question.options?.min || 0}
            max={question.options?.max || 100}
            step={question.options?.step || 1}
          />
        );

      case 'Multi-Slider':
        // For Multi-Slider, render question text once, then individual sliders for each dimension
        if (question.options?.dimensions && question.options.dimensions.length > 0) {
          return (
            <div className="space-y-8">
              <h3 className="text-green-600 font-medium">
                {question.question}
              </h3>
              {question.options.dimensions.map((dimension: any, index: number) => (
                <div key={index} className="space-y-2">
                  <label className="text-[14px] font-[300] font-golos text-gray-900">
                    {dimension.label}
                  </label>
                  <SliderQuestion
                    question=""
                    onChange={commonProps.onChange}
                    value={0}
                    min={dimension.min_value || 0}
                    max={dimension.max_value || 100}
                    step={dimension.step || 1}
                  />
                </div>
              ))}
            </div>
          );
        } else {
          // Fallback if no dimensions
          return (
            <div className="p-4 bg-gray-100 rounded-lg">
              <p className="text-gray-600">Multi-Slider configuration not found</p>
            </div>
          );
        }

      case 'RATING':
        return (
          <StarRatingQuestion
            {...commonProps}
            maxStars={Math.max(question.options?.maxStars || 5, 3)}
            labels={question.options?.labels || []}
          />
        );

      case 'NPS':
        // Convert options to VisualRatingOptions format with fixed 4 options (matching VisualRatingQuestion)
        const defaultNpsLabels = ['Not at all likely', 'Slightly likely', 'Somewhat likely', 'Very likely'];
        const npsLabels = question.options?.labels;
        // Use saved labels if they exist, otherwise use defaults
        // Preserve empty strings from saved labels
        const npsOptions = [
          { value: "0", label: npsLabels?.[0] !== undefined ? npsLabels[0] : defaultNpsLabels[0] },
          { value: "1", label: npsLabels?.[1] !== undefined ? npsLabels[1] : defaultNpsLabels[1] },
          { value: "2", label: npsLabels?.[2] !== undefined ? npsLabels[2] : defaultNpsLabels[2] },
          { value: "3", label: npsLabels?.[3] !== undefined ? npsLabels[3] : defaultNpsLabels[3] }
        ];
        return (
          <VisualRatingQuestion
            {...commonProps}
            options={npsOptions}
          />
        );

      case 'Smiley face':
        // Convert options to the format expected by VisualRatingQuestion (max 4 options, no emoji)
        const visualOptions = (question.options?.options || [])
          .slice(0, 4) // Limit to 4 options
          .map((option: any) => ({
            value: option.value.toString(),
            label: option.label
          }));
        return (
          <VisualRatingQuestion
            {...commonProps}
            options={visualOptions}
          />
        );

      case 'Checkbox':
        const checkboxOptions = (question.options?.choices || []).map((choice: QuestionChoiceItem | string) => {
          const meta = getChoiceMeta(choice);
          return {
            value: meta.value,
            label: meta.label
          };
        });
        return (
          <MultipleChoiceQuestion
            {...commonProps}
            options={checkboxOptions}
          />
        );

      default:
        return (
          <div className="p-4 bg-gray-100 rounded-lg">
            <p className="text-gray-600">Question type "{question.type}" not supported</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={onBackToQuestionList}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <img src={BackIcon} alt="Back" className="w-8 h-8" />
          </button>
          <h1 
            className="text-gray-800"
            style={{
              fontFamily: 'Baskervville',
              fontWeight: 600,
              fontStyle: 'normal',
              fontSize: '40px'
            }}
          >
            Edit {categoryTitle} Questions
          </h1>
        </div>
         {/* Add Question Dropdown */}
        <div className="flex justify-center pt-6">
          <QuestionTypeDropdown
            questionTypes={questionTypes}
            onSelectType={handleQuestionTypeSelect}
            isLoading={questionTypesLoading}
            disabled={questionTypesLoading}
          />
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {questionsList.map((question) => (
          <div key={question.id}>
            {editingQuestionId === question.order ? (
              // Edit Mode - Show editor based on question type
              (question.type === 'single-choice' || (question.type === 'Multi-select' && question.options?.type === 'single-choice')) ? (
                <SingleChoiceQuestionEditor
                  question={question}
                  onSave={handleSaveQuestion}
                  onCancel={handleCancelEdit}
                  onDelete={handleOpenDeleteModal}
                  isLoading={isUpdating}
                  sections={sections}
                  questionCodesMap={questionCodesMap}
                  isQuestionCodesLoading={questionCodesLoading}
                />
              ) : question.type === 'Multi-select' && question.options?.type === 'multiple-choice' ? (
                <MultipleChoiceQuestionEditor
                  question={question}
                  onSave={handleSaveQuestion}
                  onCancel={handleCancelEdit}
                  onDelete={handleOpenDeleteModal}
                  isLoading={isUpdating}
                  sections={sections}
                  questionCodesMap={questionCodesMap}
                  isQuestionCodesLoading={questionCodesLoading}
                />
              ) : question.type === 'Checkbox' ? (
                <MultipleChoiceQuestionEditor
                  question={question}
                  onSave={handleSaveQuestion}
                  onCancel={handleCancelEdit}
                  onDelete={handleOpenDeleteModal}
                  isLoading={isUpdating}
                  sections={sections}
                  questionCodesMap={questionCodesMap}
                  isQuestionCodesLoading={questionCodesLoading}
                />
              ) : question.type === 'Slider' || question.type === 'Linear Scale' ? (
                <SliderQuestionEditor
                  question={question}
                  onSave={handleSaveQuestion}
                  onCancel={handleCancelEdit}
                  onDelete={handleOpenDeleteModal}
                  isLoading={isUpdating}
                />
              ) : question.type === 'Multi-Slider' ? (
                <SliderQuestionEditor
                  question={question}
                  onSave={handleSaveQuestion}
                  onCancel={handleCancelEdit}
                  onDelete={handleOpenDeleteModal}
                  isLoading={isUpdating}
                />
              ) : question.type === 'RATING' ? (
                <StarRatingQuestionEditor
                  question={question}
                  onSave={handleSaveQuestion}
                  onCancel={handleCancelEdit}
                  onDelete={handleOpenDeleteModal}
                  isLoading={isUpdating}
                />
              ) : question.type === 'NPS' ? (
                <NPSQuestionEditor
                  question={question}
                  onSave={handleSaveQuestion}
                  onCancel={handleCancelEdit}
                  onDelete={handleOpenDeleteModal}
                  isLoading={isUpdating}
                />
              ) : question.type === 'Smiley face' ? (
                // Visual Rating Editor - Coming Soon
                <Card className="p-6">
                  <CardContent className="p-0">
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">Visual Rating Editor coming soon!</p>
                      <div className="flex justify-center space-x-3">
                        <Button
                          variant="outline"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="gradient"
                          onClick={handleCancelEdit}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                // For other question types, show placeholder for now
                <Card className="p-6">
                  <CardContent className="p-0">
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">Editor for "{question.type}" questions coming soon!</p>
                      <div className="flex justify-center space-x-3">
                        <Button
                          variant="outline"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="gradient"
                          onClick={handleCancelEdit}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            ) : (
              // View Mode - Show question card
              <Card 
                key={question.id} 
                className="p-6 cursor-pointer hover:shadow-md transition-shadow duration-200"
                onClick={() => handleCardClick(question.order)}
              >
                <CardContent className="p-0">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <span 
                          className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full"
                          style={{
                            fontFamily: 'Golos Text',
                            fontWeight: 500,
                            fontStyle: 'normal',
                            fontSize: '14px'
                          }}
                        >
                          Order: {question.order}
                        </span>
                        <span 
                          className="text-sm font-medium text-gray-500"
                          style={{
                            fontFamily: 'Golos Text',
                            fontWeight: 400,
                            fontStyle: 'normal',
                            fontSize: '14px'
                          }}
                        >
                          Question {question.order}
                        </span>
                        <span
                          className={`px-3 py-1 text-sm font-medium rounded-full ${
                            question.status === 'Inactive'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                          style={{
                            fontFamily: 'Golos Text',
                            fontWeight: 500,
                            fontStyle: 'normal',
                            fontSize: '12px'
                          }}
                        >
                          {question.status === 'Inactive' ? 'Inactive' : 'Active'}
                        </span>
                      </div>
                      <span 
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                        style={{
                          fontFamily: 'Golos Text',
                          fontWeight: 400,
                          fontStyle: 'normal',
                          fontSize: '12px'
                        }}
                      >
                        {question.type}
                      </span>
                    </div>
                  </div>
                  
                  {/* Render the appropriate question component */}
                  <div className="mt-4">
                    {renderQuestionComponent(question)}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        title="Are you Sure?"
        message="This question will be deleted permanently."
        confirmText="Yes"
        cancelText="No"
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDeleteModal}
      />

      {/* Create Question Modal */}
      <CreateQuestionModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        questionType={selectedQuestionType}
        sectionId={sectionId}
        onCreateQuestion={handleCreateQuestion}
        isCreating={isCreatingQuestion}
        createError={createQuestionError}
        maxOrder={Math.max(...questionsList.map(q => q.order), 0)}
        sections={sections}
        questionCodesMap={questionCodesMap}
        isQuestionCodesLoading={questionCodesLoading}
      />
    </div>
  );
};

export default EditQuestionsPage;
