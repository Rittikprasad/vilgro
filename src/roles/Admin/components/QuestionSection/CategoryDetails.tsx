import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '../../../../components/ui/Button';
import { Card, CardHeader, CardContent, CardFooter } from '../../../../components/ui/Card';
import type { QuestionCategory } from './SectorCategories';
import QuestionListTable from './QuestionListTable';
import EditQuestionsPage from './EditQuestionsPage';
import type { QuestionItem } from './QuestionListTable';
import { fetchAdminSections } from '../../../../features/question-builder/questionBuilderSlice';
import type { RootState } from '../../../../app/store';
import type { AdminSection } from '../../../../features/question-builder/types';

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
  const dispatch = useDispatch();
  const { sections, isLoading, error } = useSelector((state: RootState) => state.questionBuilder);
  
  const [showQuestionList, setShowQuestionList] = useState<boolean>(false);
  const [showEditQuestions, setShowEditQuestions] = useState<boolean>(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState<QuestionSubCategory | null>(null);
  const [questionsToEdit, setQuestionsToEdit] = useState<QuestionItem[]>([]);

  // Fetch admin sections on component mount
  useEffect(() => {
    dispatch(fetchAdminSections() as any);
  }, [dispatch]);

  // Helper function to assign weightage based on section code
  const getWeightageForSection = (code: string): number => {
    switch (code) {
      case 'IMPACT': return 40;
      case 'RISK': return 30;
      case 'RETURN': return 20;
      case 'SECTOR_MATURITY': return 10;
      case 'FEEDBACK': return 5;
      default: return 10;
    }
  };

  // Convert API sections to sub-categories with dummy data
  console.log("CategoryDetails - sections from state:", sections);
  console.log("CategoryDetails - sections length:", sections?.length);
  
  const subCategories: QuestionSubCategory[] = (sections || []).map((section: AdminSection) => ({
    id: section.code.toLowerCase(),
    title: section.title,
    weightage: getWeightageForSection(section.code),
    totalQuestions: 16, // Dummy data - will come from API later
    activeQuestions: 16, // Dummy data - will come from API later
    inactiveQuestions: 0, // Dummy data - will come from API later
  }));

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
    // Find the section data to get the section ID
    const sectionData = (sections || []).find(section => section.title === selectedSubCategory.title);
    const sectionId = sectionData?.id || '';
    
    return (
      <EditQuestionsPage 
        questions={questionsToEdit}
        categoryTitle={selectedSubCategory.title}
        onBackToQuestionList={handleBackToQuestionList}
        sectionId={sectionId}
      />
    );
  }

  // Show QuestionListTable if a sub-category is selected
  if (showQuestionList && selectedSubCategory) {
    // Find the section code from the sections data
    const sectionData = (sections || []).find(section => section.title === selectedSubCategory.title);
    const sectionCode = sectionData?.code || '';
    
    return (
      <QuestionListTable 
        onBackToCategoryDetails={handleBackToSubCategories}
        categoryTitle={selectedSubCategory.title}
        onEditQuestions={handleEditQuestions}
        sectionCode={sectionCode}
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

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading sections...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <Button
            variant="outline"
            onClick={() => dispatch(fetchAdminSections() as any)}
          >
            Retry
          </Button>
        </div>
      )}

      {/* Question Sub-Categories Grid */}
      {!isLoading && !error && (
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
      )}

      {/* No sections available */}
      {!isLoading && !error && subCategories.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">No sections available</p>
        </div>
      )}
    </div>
  );
};

export default CategoryDetails;
