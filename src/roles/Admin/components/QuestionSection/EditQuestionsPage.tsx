import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '../../../../components/ui/Button';
import { Card, CardContent } from '../../../../components/ui/Card';
import type { QuestionItem } from './QuestionListTable';
import type { RootState } from '../../../../app/store';
import { getQuestionTypes, createQuestion, clearError } from '../../../../features/assessment/assessmentSlice';
import { updateAdminQuestion } from '../../../../features/question-builder/questionBuilderSlice';
import QuestionTypeDropdown from './QuestionTypeDropdown';
import CreateQuestionModal from './CreateQuestionModal';
import type { QuestionType, CreateQuestionPayload } from '../../../../services/adminApi';

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

interface EditQuestionsPageProps {
  questions: QuestionItem[];
  categoryTitle: string;
  onBackToQuestionList: () => void;
  sectionId: string; // Add sectionId prop for creating questions
}

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
    questionTypesError,
    isCreatingQuestion,
    createQuestionError
  } = useSelector((state: RootState) => state.assessment);

  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
  const [questionsList, setQuestionsList] = useState<QuestionItem[]>(questions);
  const [selectedQuestionType, setSelectedQuestionType] = useState<QuestionType | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch question types on component mount
  useEffect(() => {
    if (questionTypes.length === 0) {
      dispatch(getQuestionTypes() as any);
    }
  }, [dispatch, questionTypes.length]);

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
    };

    // Add type-specific options
    if (question.options) {
      if (question.type === 'Multi-select' && question.options.type === 'single-choice') {
        payload.type = 'SINGLE_CHOICE';
        payload.options = question.options.choices.map((choice: string) => ({
          label: choice,
          value: choice.toLowerCase().replace(/\s+/g, '_'),
          points: '1'
        }));
      } else if (question.type === 'Multi-select' && question.options.type === 'multiple-choice') {
        payload.type = 'MULTI_CHOICE';
        payload.options = question.options.choices.map((choice: string) => ({
          label: choice,
          value: choice.toLowerCase().replace(/\s+/g, '_'),
          points: '1'
        }));
      } else if (question.type === 'Checkbox') {
        payload.type = 'MULTI_CHOICE';
        payload.options = question.options.choices.map((choice: string) => ({
          label: choice,
          value: choice.toLowerCase().replace(/\s+/g, '_'),
          points: '1'
        }));
      } else if (question.type === 'Slider' || question.type === 'Linear Scale') {
        payload.type = 'SLIDER';
        payload.dimensions = [{
          code: question.options?.dimensionCode || 'slider',
          label: question.options?.dimensionLabel || 'Slider',
          min_value: question.options?.min || 0,
          max_value: question.options?.max || 100,
          points_per_unit: question.options?.pointsPerUnit || 1,
          weight: question.weight
        }];
      } else if (question.type === 'Multi-Slider') {
        payload.type = 'MULTI_SLIDER';
        payload.dimensions = question.options?.dimensions || [
          { code: 'dimension1', label: 'Dimension 1', min_value: 0, max_value: 100, points_per_unit: 1, weight: question.weight },
          { code: 'dimension2', label: 'Dimension 2', min_value: 0, max_value: 100, points_per_unit: 1, weight: question.weight }
        ];
      } else if (question.type === 'RATING') {
        payload.type = 'RATING';
        payload.options = Array.from({ length: question.options?.maxStars || 5 }, (_, i) => ({
          label: question.options?.labels?.[i] || `${i + 1}`,
          value: (i + 1).toString(),
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

  // Handle question type selection from dropdown
  const handleQuestionTypeSelect = (questionType: QuestionType) => {
    setSelectedQuestionType(questionType);
    setIsCreateModalOpen(true);
  };

  // Handle creating a new question
  const handleCreateQuestion = (payload: any) => {
    dispatch(createQuestion(payload) as any);
  };

  // Handle successful question creation
  const handleQuestionCreated = async (question: QuestionItem) => {
    try {
      // Check for order conflicts with existing questions
      const conflictingQuestion = questionsList.find(q => q.order === question.order);
      
      if (conflictingQuestion) {
        // If there's a conflict, we need to shift all questions with order >= new question's order
        const updatedQuestionsList = questionsList.map(q => 
          q.order >= question.order ? { ...q, order: q.order + 1 } : q
        );
        
        // Add the new question
        updatedQuestionsList.push(question);
        
        // Update local state
        setQuestionsList(updatedQuestionsList);
        
        // Update all affected questions via API
        const updatePromises = updatedQuestionsList
          .filter(q => q.id !== question.id) // Exclude the new question
          .map(q => {
            const payload = convertQuestionItemToPayload(q);
            return dispatch(updateAdminQuestion({ 
              id: q.id,
              data: payload 
            }) as any);
          });
        
        if (updatePromises.length > 0) {
          await Promise.all(updatePromises);
        }
        
        console.log('Question created with order conflict resolution');
      } else {
        // No conflict, just add the new question
        setQuestionsList([...questionsList, question]);
      }
      
      setIsCreateModalOpen(false);
      setSelectedQuestionType(null);
    } catch (error) {
      console.error('Error handling question creation:', error);
    }
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
      case 'Multi-select':
        if (question.options?.type === 'single-choice') {
          // Convert string array to {value, label} format
          const formattedOptions = question.options.choices.map((choice: string) => ({
            value: choice.toLowerCase().replace(/\s+/g, '_'),
            label: choice
          }));
          return (
            <SingleChoiceQuestion
              {...commonProps}
              options={formattedOptions}
            />
          );
        } else if (question.options?.type === 'multiple-choice') {
          // Convert string array to {value, label} format
          const formattedOptions = question.options.choices.map((choice: string) => ({
            value: choice.toLowerCase().replace(/\s+/g, '_'),
            label: choice
          }));
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
        // For Multi-Slider, render multiple SliderQuestion components
        if (question.options?.dimensions && question.options.dimensions.length > 0) {
          return (
            <div className="space-y-4">
              {question.options.dimensions.map((dimension: any, index: number) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    {dimension.label}
                  </h4>
                  <SliderQuestion
                    {...commonProps}
                    value={0}
                    min={dimension.min_value || 0}
                    max={dimension.max_value || 100}
                    step={1}
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
            maxStars={question.options?.maxStars || 5}
            labels={question.options?.labels || []}
          />
        );

      case 'Smiley face':
        // Convert options to the format expected by VisualRatingQuestion
        const visualOptions = question.options?.options?.map((option: any) => ({
          value: option.value.toString(),
          emoji: option.emoji,
          label: option.label
        })) || [];
        return (
          <VisualRatingQuestion
            {...commonProps}
            options={visualOptions}
          />
        );

      case 'Checkbox':
        // Convert string array to {value, label} format
        const checkboxOptions = question.options?.choices?.map((choice: string) => ({
          value: choice.toLowerCase().replace(/\s+/g, '_'),
          label: choice
        })) || [];
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
          <Button 
            variant="outline" 
            onClick={onBackToQuestionList}
            className="flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Questions List</span>
          </Button>
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
            disabled={questionTypesError !== null}
          />
        </div>
        <Button 
          variant="gradient"
          className="px-6 py-3"
        >
          Publish
        </Button>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {questionsList.map((question) => (
          <div key={question.id}>
            {editingQuestionId === question.order ? (
              // Edit Mode - Show editor based on question type
              question.type === 'Multi-select' && question.options?.type === 'single-choice' ? (
                <SingleChoiceQuestionEditor
                  question={question}
                  onSave={handleSaveQuestion}
                  onCancel={handleCancelEdit}
                  isLoading={isUpdating}
                />
              ) : question.type === 'Multi-select' && question.options?.type === 'multiple-choice' ? (
                <MultipleChoiceQuestionEditor
                  question={question}
                  onSave={handleSaveQuestion}
                  onCancel={handleCancelEdit}
                  isLoading={isUpdating}
                />
              ) : question.type === 'Checkbox' ? (
                <MultipleChoiceQuestionEditor
                  question={question}
                  onSave={handleSaveQuestion}
                  onCancel={handleCancelEdit}
                  isLoading={isUpdating}
                />
              ) : question.type === 'Slider' || question.type === 'Linear Scale' ? (
                <SliderQuestionEditor
                  question={question}
                  onSave={handleSaveQuestion}
                  onCancel={handleCancelEdit}
                  isLoading={isUpdating}
                />
              ) : question.type === 'Multi-Slider' ? (
                <SliderQuestionEditor
                  question={question}
                  onSave={handleSaveQuestion}
                  onCancel={handleCancelEdit}
                  isLoading={isUpdating}
                />
              ) : question.type === 'RATING' ? (
                <StarRatingQuestionEditor
                  question={question}
                  onSave={handleSaveQuestion}
                  onCancel={handleCancelEdit}
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

      {/* Create Question Modal */}
      <CreateQuestionModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        questionType={selectedQuestionType}
        sectionId={sectionId}
        onQuestionCreated={handleQuestionCreated}
        onCreateQuestion={handleCreateQuestion}
        isCreating={isCreatingQuestion}
        createError={createQuestionError}
        maxOrder={Math.max(...questionsList.map(q => q.order), 0)}
      />
    </div>
  );
};

export default EditQuestionsPage;
