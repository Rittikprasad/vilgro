import React, { useState } from 'react';
import LayoutWrapper from '../layout/LayoutWrapper';
import { SectorCategories, CategoryDetails } from '../components/QuestionSection';
import type { QuestionCategory } from '../components/QuestionSection';

// Question categories data
const questionCategories: QuestionCategory[] = [
  {
    id: 'agriculture',
    title: 'Agriculture',
    totalQuestions: 16,
    impactQuestions: 16,
    riskQuestions: 16,
    returnQuestions: 16,
  },
  {
    id: 'waste-management',
    title: 'Waste management / recycling',
    totalQuestions: 16,
    impactQuestions: 16,
    riskQuestions: 16,
    returnQuestions: 16,
  },
  {
    id: 'livelihood',
    title: 'Livelihood Creation',
    totalQuestions: 16,
    impactQuestions: 16,
    riskQuestions: 16,
    returnQuestions: 16,
  },
  {
    id: 'health',
    title: 'Health',
    totalQuestions: 16,
    impactQuestions: 16,
    riskQuestions: 16,
    returnQuestions: 16,
  },
  {
    id: 'others',
    title: 'Others',
    totalQuestions: 16,
    impactQuestions: 16,
    riskQuestions: 16,
    returnQuestions: 16,
  },
];

const QuestionsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory | null>(null);

  // Handle category selection
  const handleViewQuestions = (categoryId: string) => {
    const category = questionCategories.find(cat => cat.id === categoryId);
    if (category) {
      setSelectedCategory(category);
    }
  };

  // Handle back to list view
  const handleBackToList = () => {
    setSelectedCategory(null);
  };

  return (
    <LayoutWrapper>
      {selectedCategory ? (
        <CategoryDetails 
          category={selectedCategory} 
          onBackToList={handleBackToList} 
        />
      ) : (
        <SectorCategories 
          categories={questionCategories} 
          onCategorySelect={handleViewQuestions} 
        />
      )}
    </LayoutWrapper>
  );
};

export default QuestionsPage;
