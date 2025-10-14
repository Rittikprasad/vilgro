import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '../../../../components/ui/Button';
import { Card, CardContent } from '../../../../components/ui/Card';
import { fetchQuestionsBySection } from '../../../../features/question-builder/questionBuilderSlice';
import type { RootState } from '../../../../app/store';
import type { AdminQuestion } from '../../../../features/question-builder/types';

// Define a type for a single question item
export interface QuestionItem {
  order: number;
  question: string;
  type: string;
  weight: number;
  status: string;
  options?: any; // Options for different question types
}

interface QuestionListTableProps {
  onBackToCategoryDetails: () => void;
  categoryTitle: string; // To display which category these questions belong to
  onEditQuestions: (questions: QuestionItem[]) => void; // New prop for editing questions
  sectionCode: string; // Section code to fetch questions
}

const mockQuestions: QuestionItem[] = [
  { 
    order: 1, 
    question: 'What is the level of innovation introduced by the intervention?', 
    type: 'Multi-select', 
    weight: 1, 
    status: 'Active',
    options: {
      type: 'single-choice',
      choices: [
        'Minimal innovation; follows established practices with little change.',
        'Some innovation; introduces new practices or slight improvements.',
        'High innovation; introduces new and effective practices or technologies.',
        'Breakthrough innovation; pioneering new approaches with potential for significant change.'
      ]
    }
  },
  { 
    order: 2, 
    question: 'What is the impact on the affordability of products / services for the target group?', 
    type: 'Slider', 
    weight: 1, 
    status: 'Active',
    options: {
      min: 0,
      max: 100,
      step: 1,
      pointsPerUnit: 1
    }
  },
  { 
    order: 3, 
    question: 'What is the impact on access to the product/service for the target group?', 
    type: 'Multi-select', 
    weight: 1, 
    status: 'Active',
    options: {
      type: 'multiple-choice',
      choices: [
        'Significantly improved access',
        'Moderately improved access',
        'Minimal improvement in access',
        'No change in access',
        'Decreased access'
      ]
    }
  },
  { 
    order: 4, 
    question: 'What is the impact on the quality of products/services provided?', 
    type: 'Rating Scale', 
    weight: 1, 
    status: 'Active',
    options: {
      type: 'star-rating',
      maxStars: 4,
      labels: [
        'Quality is inconsistent.',
        'Quality is better',
        'Quality meets standards',
        'Quality exceeds expectations'
      ]
    }
  },
  { 
    order: 5, 
    question: 'What is the impact on the income of the target disadvantaged group?', 
    type: 'Linear Scale', 
    weight: 2, 
    status: 'Active',
    options: {
      min: 0,
      max: 100,
      step: 10,
      pointsPerUnit: 2
    }
  },
  { 
    order: 6, 
    question: 'What is the impact on the quality of life for the user?', 
    type: 'Smiley face', 
    weight: 3, 
    status: 'Active',
    options: {
      type: 'visual-rating',
      options: [
        { emoji: '😞', label: 'Little to no improvement in quality of life.', value: 1 },
        { emoji: '😐', label: 'Some marginal improvements in quality of life.', value: 2 },
        { emoji: '🙂', label: 'Noticeable improvements in living conditions, health, or safety.', value: 3 },
        { emoji: '😁', label: 'Substantial improvements, creating long-term positive impacts on well-being and living conditions.', value: 4 }
      ]
    }
  },
  { 
    order: 7, 
    question: 'The intervention focus towards underserved in reference to Household Income (HI) is?', 
    type: 'Multi-select', 
    weight: 2, 
    status: 'Active',
    options: {
      type: 'multiple-choice',
      choices: [
        'Primarily targets lowest income quartile',
        'Targets lower-middle income groups',
        'Mixed income targeting',
        'Broad income range targeting'
      ]
    }
  },
  { 
    order: 8, 
    question: 'How inclusive is the intervention from a gender perspective?', 
    type: 'Smiley face', 
    weight: 1, 
    status: 'Active',
    options: {
      type: 'visual-rating',
      options: [
        { emoji: '😞', label: 'Not gender inclusive', value: 1 },
        { emoji: '😐', label: 'Minimally gender inclusive', value: 2 },
        { emoji: '🙂', label: 'Moderately gender inclusive', value: 3 },
        { emoji: '😁', label: 'Highly gender inclusive', value: 4 }
      ]
    }
  },
  { 
    order: 9, 
    question: 'What is the focus on underserved geographies?', 
    type: 'Checkbox', 
    weight: 1, 
    status: 'Active',
    options: {
      type: 'multiple-choice',
      choices: [
        'Rural areas',
        'Urban slums',
        'Remote regions',
        'Border areas',
        'Coastal regions',
        'Mountainous areas',
        'Tribal regions'
      ]
    }
  },
  { 
    order: 10, 
    question: 'What is the impact on the GHG emissions of the enterprise\'s intervention?', 
    type: 'Slider', 
    weight: 1, 
    status: 'Active',
    options: {
      min: -50,
      max: 50,
      step: 5,
      pointsPerUnit: 1
    }
  },
  { 
    order: 11, 
    question: 'What is the impact on scarce natural resources of the enterprise\'s intervention?', 
    type: 'Multi-select', 
    weight: 1, 
    status: 'Active',
    options: {
      type: 'multiple-choice',
      choices: [
        'Reduces water consumption',
        'Reduces energy consumption',
        'Reduces material waste',
        'Improves resource efficiency',
        'No significant impact on resources'
      ]
    }
  },
  { 
    order: 12, 
    question: 'How much of the impact is attributable to the enterprise\'s intervention?', 
    type: 'Rating Scale', 
    weight: 1, 
    status: 'Active',
    options: {
      type: 'star-rating',
      maxStars: 5,
      labels: [
        'Minimal attribution (0-20%)',
        'Low attribution (21-40%)',
        'Moderate attribution (41-60%)',
        'High attribution (61-80%)',
        'Very high attribution (81-100%)'
      ]
    }
  },
  { 
    order: 13, 
    question: 'What is the impact additionality from the blended finance intervention?', 
    type: 'Multi-select', 
    weight: 1, 
    status: 'Active',
    options: {
      type: 'multiple-choice',
      choices: [
        'Significant additionality',
        'Moderate additionality',
        'Minimal additionality',
        'No additionality',
        'Negative additionality'
      ]
    }
  },
  { 
    order: 14, 
    question: 'What is the potential scale of the intervention?', 
    type: 'Slider', 
    weight: 4, 
    status: 'Active',
    options: {
      min: 0,
      max: 100,
      step: 1,
      pointsPerUnit: 4
    }
  },
];

// Helper function to convert API questions to QuestionItem format
const convertApiQuestionsToQuestionItems = (apiQuestions: AdminQuestion[]): QuestionItem[] => {
  return apiQuestions.map(question => ({
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
    case 'SINGLE_CHOICE': return 'Multi-select';
    case 'MULTI_SLIDER': return 'Slider';
    case 'MULTI_CHOICE': return 'Multi-select';
    case 'STAR_RATING': return 'Rating Scale';
    case 'VISUAL_RATING': return 'Smiley face';
    case 'SLIDER': return 'Slider';
    default: return apiType;
  }
};

// Helper function to convert question options based on type
const convertQuestionOptions = (question: AdminQuestion): any => {
  if (question.options && question.options.length > 0) {
    // For choice-based questions
    return {
      type: question.type === 'SINGLE_CHOICE' ? 'single-choice' : 'multiple-choice',
      choices: question.options.map(option => option.label)
    };
  } else if (question.dimensions && question.dimensions.length > 0) {
    // For slider questions
    const dimension = question.dimensions[0]; // Use first dimension
    return {
      min: dimension.min_value,
      max: dimension.max_value,
      step: 1,
      pointsPerUnit: parseFloat(dimension.points_per_unit)
    };
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
  categoryTitle,
  onEditQuestions,
  sectionCode
}) => {
  const dispatch = useDispatch();
  const { questions, questionsLoading, questionsError } = useSelector((state: RootState) => state.questionBuilder);

  // Fetch questions when component mounts or sectionCode changes
  useEffect(() => {
    if (sectionCode) {
      dispatch(fetchQuestionsBySection(sectionCode) as any);
    }
  }, [dispatch, sectionCode]);

  // Convert API questions to display format
  const displayQuestions = convertApiQuestionsToQuestionItems(questions);
  return (
    <div className="space-y-6">
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
            <span>Back to {categoryTitle}</span>
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
            List of Impact Questions
          </h1>
        </div>
        <Button 
          variant="gradient"
          className="px-6 py-3"
          onClick={() => onEditQuestions(displayQuestions)}
          disabled={questionsLoading || questionsError !== null}
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
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      style={{
                        fontFamily: 'Golos Text',
                        fontWeight: 400,
                        fontStyle: 'normal',
                        fontSize: '12px'
                      }}
                    >
                      Order
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      style={{
                        fontFamily: 'Golos Text',
                        fontWeight: 400,
                        fontStyle: 'normal',
                        fontSize: '12px'
                      }}
                    >
                      Questions
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      style={{
                        fontFamily: 'Golos Text',
                        fontWeight: 400,
                        fontStyle: 'normal',
                        fontSize: '12px'
                      }}
                    >
                      Type
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      style={{
                        fontFamily: 'Golos Text',
                        fontWeight: 400,
                        fontStyle: 'normal',
                        fontSize: '12px'
                      }}
                    >
                      Weight
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      style={{
                        fontFamily: 'Golos Text',
                        fontWeight: 400,
                        fontStyle: 'normal',
                        fontSize: '12px'
                      }}
                    >
                      Status
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      style={{
                        fontFamily: 'Golos Text',
                        fontWeight: 400,
                        fontStyle: 'normal',
                        fontSize: '12px'
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
                          className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                          style={{
                            fontFamily: 'Golos Text',
                            fontWeight: 400,
                            fontStyle: 'normal',
                            fontSize: '10px'
                          }}
                        >
                          {item.order}
                        </td>
                        <td 
                          className="px-6 py-4 text-sm text-gray-900"
                          style={{
                            fontFamily: 'Golos Text',
                            fontWeight: 400,
                            fontStyle: 'normal',
                            fontSize: '10px'
                          }}
                        >
                          {item.question}
                        </td>
                        <td 
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                          style={{
                            fontFamily: 'Golos Text',
                            fontWeight: 400,
                            fontStyle: 'normal',
                            fontSize: '10px'
                          }}
                        >
                          {item.type}
                        </td>
                        <td 
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                          style={{
                            fontFamily: 'Golos Text',
                            fontWeight: 400,
                            fontStyle: 'normal',
                            fontSize: '10px'
                          }}
                        >
                          {item.weight}
                        </td>
                        <td 
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                          style={{
                            fontFamily: 'Golos Text',
                            fontWeight: 400,
                            fontStyle: 'normal',
                            fontSize: '10px'
                          }}
                        >
                          {item.status}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
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
