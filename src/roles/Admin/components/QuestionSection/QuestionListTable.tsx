import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '../../../../components/ui/Button';
import { Card, CardContent } from '../../../../components/ui/Card';
import ConfirmationModal from '../../../../components/ui/ConfirmationModal';
import { fetchQuestionsBySection, deleteAdminQuestion } from '../../../../features/question-builder/questionBuilderSlice';
import type { RootState } from '../../../../app/store';
import type { AdminQuestion } from '../../../../features/question-builder/types';

// Define a type for a single question item
export interface QuestionItem {
  id: number;
  order: number;
  question: string;
  type: string;
  weight: number;
  status: string;
  options?: any; // Options for different question types
  conditions?: Array<{
    logic: {
      q: string;
      op: string;
      val: string;
    };
  }>;
}

interface QuestionListTableProps {
  onBackToCategoryDetails: () => void;
  categoryTitle: string; // To display which category these questions belong to
  onEditQuestions: (questions: QuestionItem[]) => void; // New prop for editing questions
  sectionCode: string; // Section code to fetch questions
}

// Helper function to convert API questions to QuestionItem format
const convertApiQuestionsToQuestionItems = (apiQuestions: AdminQuestion[]): QuestionItem[] => {
  return apiQuestions.map(question => ({
    id: question.id,
    order: question.order,
    question: question.text,
    type: convertQuestionType(question.type),
    weight: parseFloat(question.weight),
    status: 'Active', // Default status since API doesn't provide this
    options: convertQuestionOptions(question)
  }));
};

// Helper function to convert API question type to display type
const convertQuestionType = (apiType: string): string => {
  switch (apiType) {
    case 'SINGLE_CHOICE': return 'single-choice';
    case 'MULTI_SLIDER': return 'Multi-Slider';
    case 'MULTI_CHOICE': return 'Multi-select';
    case 'RATING': return 'RATING';
    case 'STAR_RATING': return 'RATING';
    case 'VISUAL_RATING': return 'Smiley face';
    case 'SLIDER': return 'Slider';
    case 'NPS': return 'NPS';
    default: return apiType;
  }
};

// Helper function to convert question options based on type
const convertQuestionOptions = (question: AdminQuestion): any => {
  if (question.options && question.options.length > 0) {
    // For RATING questions, return labels and maxStars
    if (question.type === 'RATING') {
      return {
        maxStars: question.options.length,
        labels: question.options.map(option => option.label)
      };
    }
    
    // For NPS questions, return labels and maxStars (fixed to 5)
    if (question.type === 'NPS') {
      return {
        maxStars: question.options.length || 5,
        labels: question.options.map(option => option.label)
      };
    }
    
    // For choice-based questions
    return {
      type: question.type === 'SINGLE_CHOICE' ? 'single-choice' : 'multiple-choice',
      choices: question.options.map(option => option.label)
    };
  } else if (question.dimensions && question.dimensions.length > 0) {
    // For slider questions
    if (question.type === 'MULTI_SLIDER') {
      // Multi-slider: return dimensions array
      return {
        dimensions: question.dimensions.map(dim => ({
          code: dim.code,
          label: dim.label,
          min_value: dim.min_value,
          max_value: dim.max_value,
          points_per_unit: dim.points_per_unit,
          weight: dim.weight
        }))
      };
    } else {
      // Single slider: use first dimension
      const dimension = question.dimensions[0];
      return {
        min: dimension.min_value,
        max: dimension.max_value,
        step: 1,
        pointsPerUnit: parseFloat(dimension.points_per_unit),
        dimensionCode: dimension.code,
        dimensionLabel: dimension.label
      };
    }
  }
  return {};
};

/**
 * QuestionListTable Component
 * Displays a detailed list of questions in a table format.
 * This is the third level view, showing actual questions within a sub-category.
 */
const QuestionListTable: React.FC<QuestionListTableProps> = ({ 
  onBackToCategoryDetails,
  onEditQuestions,
  sectionCode
}) => {
  const dispatch = useDispatch();
  const { questions, questionsLoading, questionsError } = useSelector((state: RootState) => state.questionBuilder);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<number | null>(null);

  // Fetch questions when component mounts or sectionCode changes
  useEffect(() => {
    if (sectionCode) {
      dispatch(fetchQuestionsBySection(sectionCode) as any);
    }
  }, [dispatch, sectionCode]);

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

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (!questionToDelete) return;

    setDeletingId(questionToDelete);
    setShowDeleteModal(false);
    
    try {
      await dispatch(deleteAdminQuestion(questionToDelete) as any);
    } catch (error) {
      console.error('Failed to delete question:', error);
    } finally {
      setDeletingId(null);
      setQuestionToDelete(null);
    }
  };

  // Convert API questions to display format - ensure it's always an array
  const displayQuestions = questions && Array.isArray(questions) 
    ? convertApiQuestionsToQuestionItems(questions) 
    : [];
  
  // Handle edit questions click - always navigate, even with empty data
  const handleEditClick = () => {
    onEditQuestions(displayQuestions);
  };

  return (
    <div className="space-y-6">
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
      {/* Back button and Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={onBackToCategoryDetails}
            className="flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
          </Button>
          <h1 
            className="text-gray-800"
            style={{
              fontFamily: 'Baskervville',
              fontWeight: 600,
              fontStyle: 'normal',
              fontSize: '30px'
            }}
          >
            List of Questions
          </h1>
        </div>
        <Button 
          variant="gradient"
          className="px-6 py-3"
          onClick={handleEditClick}
          disabled={questionsLoading}
        >
          {questionsLoading ? 'Loading...' : 'Edit Questions'}
        </Button>
      </div>

      {/* Loading State */}
      {questionsLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading questions...</p>
        </div>
      )}

      {/* Error State */}
      {questionsError && (
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{questionsError}</p>
          <Button
            variant="outline"
            onClick={() => dispatch(fetchQuestionsBySection(sectionCode) as any)}
          >
            Retry
          </Button>
        </div>
      )}

      {/* Questions Table */}
      {!questionsLoading && !questionsError && (
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th 
                      scope="col" 
                      className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      style={{
                        fontFamily: 'Golos Text',
                        fontWeight: 400,
                        fontStyle: 'normal',
                        fontSize: '12px',
                        verticalAlign: 'middle',
                        paddingTop: '12px',
                        paddingBottom: '12px'
                      }}
                    >
                      Order
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      style={{
                        fontFamily: 'Golos Text',
                        fontWeight: 400,
                        fontStyle: 'normal',
                        fontSize: '12px',
                        verticalAlign: 'middle',
                        paddingTop: '12px',
                        paddingBottom: '12px'
                      }}
                    >
                      Questions
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      style={{
                        fontFamily: 'Golos Text',
                        fontWeight: 400,
                        fontStyle: 'normal',
                        fontSize: '12px',
                        verticalAlign: 'middle',
                        paddingTop: '12px',
                        paddingBottom: '12px'
                      }}
                    >
                      Type
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      style={{
                        fontFamily: 'Golos Text',
                        fontWeight: 400,
                        fontStyle: 'normal',
                        fontSize: '12px',
                        verticalAlign: 'middle',
                        paddingTop: '12px',
                        paddingBottom: '12px'
                      }}
                    >
                      Weight
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      style={{
                        fontFamily: 'Golos Text',
                        fontWeight: 400,
                        fontStyle: 'normal',
                        fontSize: '12px',
                        verticalAlign: 'middle',
                        paddingTop: '12px',
                        paddingBottom: '12px'
                      }}
                    >
                      Status
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      style={{
                        fontFamily: 'Golos Text',
                        fontWeight: 400,
                        fontStyle: 'normal',
                        fontSize: '12px',
                        verticalAlign: 'middle',
                        paddingTop: '12px',
                        paddingBottom: '12px'
                      }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayQuestions.length > 0 ? (
                    displayQuestions.map((item) => (
                      <tr key={item.order} className="hover:bg-gray-50">
                        <td 
                          className="px-6 whitespace-nowrap text-sm font-medium text-gray-900"
                          style={{
                            fontFamily: 'Golos Text',
                            fontWeight: 400,
                            fontStyle: 'normal',
                            fontSize: '10px',
                            verticalAlign: 'middle',
                            paddingTop: '16px',
                            paddingBottom: '16px'
                          }}
                        >
                          {item.order}
                        </td>
                        <td 
                          className="px-6 text-sm text-gray-900"
                          style={{
                            fontFamily: 'Golos Text',
                            fontWeight: 400,
                            fontStyle: 'normal',
                            fontSize: '10px',
                            verticalAlign: 'middle',
                            paddingTop: '16px',
                            paddingBottom: '16px'
                          }}
                        >
                          {item.question}
                        </td>
                        <td 
                          className="px-6 whitespace-nowrap text-sm text-gray-900"
                          style={{
                            fontFamily: 'Golos Text',
                            fontWeight: 400,
                            fontStyle: 'normal',
                            fontSize: '10px',
                            verticalAlign: 'middle',
                            paddingTop: '16px',
                            paddingBottom: '16px'
                          }}
                        >
                          {item.type}
                        </td>
                        <td 
                          className="px-6 whitespace-nowrap text-sm text-gray-900"
                          style={{
                            fontFamily: 'Golos Text',
                            fontWeight: 400,
                            fontStyle: 'normal',
                            fontSize: '10px',
                            verticalAlign: 'middle',
                            paddingTop: '16px',
                            paddingBottom: '16px'
                          }}
                        >
                          {item.weight}
                        </td>
                        <td 
                          className="px-6 whitespace-nowrap text-sm text-gray-900"
                          style={{
                            fontFamily: 'Golos Text',
                            fontWeight: 400,
                            fontStyle: 'normal',
                            fontSize: '10px',
                            verticalAlign: 'middle',
                            paddingTop: '16px',
                            paddingBottom: '16px'
                          }}
                        >
                          {item.status}
                        </td>
                        <td 
                          className="px-6 whitespace-nowrap text-right text-sm font-medium" 
                          style={{ 
                            verticalAlign: 'middle',
                            paddingTop: '16px',
                            paddingBottom: '16px',
                            alignContent: 'center',
                            justifyContent: 'start',
                            display: 'flex',
                            alignItems: 'start',
                            height: '100%'
                          }}
                        >
                          <button 
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => handleOpenDeleteModal(item.id)}
                            disabled={deletingId === item.id}
                          >
                            {deletingId === item.id ? (
                              <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td 
                        colSpan={6} 
                        className="px-6 text-center text-gray-500" 
                        style={{ 
                          verticalAlign: 'middle',
                          paddingTop: '16px',
                          paddingBottom: '16px'
                        }}
                      >
                        No questions found for this section
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuestionListTable;
