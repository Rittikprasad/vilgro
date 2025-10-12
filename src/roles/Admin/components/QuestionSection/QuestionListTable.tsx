import React from 'react';
import { Button } from '../../../../components/ui/Button';
import { Card, CardContent } from '../../../../components/ui/Card';

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
      unit: '%',
      label: 'Percentage improvement'
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
      unit: '%',
      label: 'Income improvement percentage'
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
      unit: '%',
      label: 'GHG emission change'
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
      min: 100,
      max: 1000000,
      step: 1000,
      unit: 'people',
      label: 'Number of people reached'
    }
  },
];

/**
 * QuestionListTable Component
 * Displays a detailed list of questions in a table format.
 * This is the third level view, showing actual questions within a sub-category.
 */
const QuestionListTable: React.FC<QuestionListTableProps> = ({ 
  onBackToCategoryDetails,
  categoryTitle,
  onEditQuestions
}) => {
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
          onClick={() => onEditQuestions(mockQuestions)}
        >
          Edit Questions
        </Button>
      </div>

      {/* Questions Table */}
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
                {mockQuestions.map((item) => (
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
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionListTable;
