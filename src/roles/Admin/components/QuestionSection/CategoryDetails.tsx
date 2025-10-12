import React, { useState } from 'react';
import { Button } from '../../../../components/ui/Button';
import { Card, CardHeader, CardContent, CardFooter } from '../../../../components/ui/Card';
import type { QuestionCategory } from './SectorCategories';
import QuestionListTable from './QuestionListTable';
import EditQuestionsPage from './EditQuestionsPage';
import type { QuestionItem } from './QuestionListTable';

// Types for the question sub-categories (Impact, Risk, Return, Others)
export interface QuestionSubCategory {
  id: string;
  title: string;
  weightage: number;
  totalQuestions: number;
  activeQuestions: number;
  inactiveQuestions: number;
}

interface CategoryDetailsProps {
  category: QuestionCategory;
  onBackToList: () => void;
}

/**
 * CategoryDetails Component
 * Shows detailed view for a specific question category with sub-categories
 * This is the second level view showing Impact, Risk, Return, Others within a category
 */
const CategoryDetails: React.FC<CategoryDetailsProps> = ({ 
  category, 
  onBackToList 
}) => {
  const [showQuestionList, setShowQuestionList] = useState<boolean>(false);
  const [showEditQuestions, setShowEditQuestions] = useState<boolean>(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState<QuestionSubCategory | null>(null);
  const [questionsToEdit, setQuestionsToEdit] = useState<QuestionItem[]>([]);

  // Generate sub-categories data based on the selected category
  const subCategories: QuestionSubCategory[] = [
    {
      id: 'impact',
      title: 'Impact',
      weightage: 40,
      totalQuestions: 16,
      activeQuestions: 16,
      inactiveQuestions: 0,
    },
    {
      id: 'risk',
      title: 'Risk',
      weightage: 30,
      totalQuestions: 16,
      activeQuestions: 16,
      inactiveQuestions: 0,
    },
    {
      id: 'return',
      title: 'Return',
      weightage: 20,
      totalQuestions: 16,
      activeQuestions: 16,
      inactiveQuestions: 0,
    },
    {
      id: 'others',
      title: 'Others',
      weightage: 10,
      totalQuestions: 16,
      activeQuestions: 16,
      inactiveQuestions: 0,
    },
  ];

  // Handle sub-category selection
  const handleViewQuestions = (subCategory: QuestionSubCategory) => {
    setSelectedSubCategory(subCategory);
    setShowQuestionList(true);
  };

  // Handle back to sub-categories
  const handleBackToSubCategories = () => {
    setShowQuestionList(false);
    setShowEditQuestions(false);
    setSelectedSubCategory(null);
    setQuestionsToEdit([]);
  };

  // Handle edit questions
  const handleEditQuestions = (questions: QuestionItem[]) => {
    setQuestionsToEdit(questions);
    setShowEditQuestions(true);
  };

  // Handle back to question list
  const handleBackToQuestionList = () => {
    setShowEditQuestions(false);
    setQuestionsToEdit([]);
  };

  // Show EditQuestionsPage if editing questions
  if (showEditQuestions && questionsToEdit.length > 0 && selectedSubCategory) {
    return (
      <EditQuestionsPage 
        questions={questionsToEdit}
        categoryTitle={selectedSubCategory.title}
        onBackToQuestionList={handleBackToQuestionList}
      />
    );
  }

  // Show QuestionListTable if a sub-category is selected
  if (showQuestionList && selectedSubCategory) {
    return (
      <QuestionListTable 
        onBackToCategoryDetails={handleBackToSubCategories}
        categoryTitle={selectedSubCategory.title}
        onEditQuestions={handleEditQuestions}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button and header */}
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline" 
          onClick={onBackToList}
          className="flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to Categories</span>
        </Button>
        <div>
          <h1 
            className="text-gray-800"
            style={{
              fontFamily: 'Baskervville',
              fontWeight: 600,
              fontStyle: 'normal',
              fontSize: '30px'
            }}
          >
            {category.title} Questions
          </h1>
        </div>
      </div>

      {/* Question Sub-Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {subCategories.map((subCategory) => (
          <Card key={subCategory.id} className="hover:shadow-md transition-shadow duration-200">
            <CardHeader>
              <h3 
                className="text-gray-800"
                style={{
                  fontFamily: 'Golos Text',
                  fontWeight: 500,
                  fontStyle: 'normal',
                  fontSize: '16px'
                }}
              >
                {subCategory.title}
              </h3>
              <p 
                className="text-gray-600"
                style={{
                  fontFamily: 'Golos Text',
                  fontWeight: 400,
                  fontStyle: 'normal',
                  fontSize: '12px'
                }}
              >
                Weightage: {subCategory.weightage}%
              </p>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <p 
                  className="text-gray-800"
                  style={{
                    fontFamily: 'Golos Text',
                    fontWeight: 600,
                    fontStyle: 'normal',
                    fontSize: '12px'
                  }}
                >
                  Total Questions: {subCategory.totalQuestions}
                </p>
                <p 
                  className="text-gray-600"
                  style={{
                    fontFamily: 'Golos Text',
                    fontWeight: 400,
                    fontStyle: 'normal',
                    fontSize: '12px'
                  }}
                >
                  Active Questions: {subCategory.activeQuestions}
                </p>
                <p 
                  className="text-gray-600"
                  style={{
                    fontFamily: 'Golos Text',
                    fontWeight: 400,
                    fontStyle: 'normal',
                    fontSize: '12px'
                  }}
                >
                  Inactive Questions: {subCategory.inactiveQuestions}
                </p>
              </div>
            </CardContent>

            <CardFooter>
              <Button 
                variant="gradient" 
                className="w-full"
                onClick={() => handleViewQuestions(subCategory)}
              >
                View all Questions
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CategoryDetails;
