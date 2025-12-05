import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LayoutWrapper from '../layout/LayoutWrapper';
import { SectorCategories, CategoryDetails } from '../components/QuestionSection';
import type { QuestionCategory } from '../components/QuestionSection';
import { fetchSectorSummary } from '../../../features/question-builder/questionBuilderSlice';
import type { RootState } from '../../../app/store';

const QuestionsPage: React.FC = () => {
  const dispatch = useDispatch();
  const { sectorSummary, sectorSummaryLoading, sectorSummaryError } = useSelector(
    (state: RootState) => state.questionBuilder
  );
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory | null>(null);

  // Fetch sector summary on component mount
  useEffect(() => {
    dispatch(fetchSectorSummary() as any);
  }, [dispatch]);

  // Transform API response to QuestionCategory format
  const questionCategories: QuestionCategory[] = useMemo(() => {
    return (sectorSummary || []).map((summary) => ({
      id: summary.sector.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-'),
      title: summary.sector,
      totalQuestions: summary.total_questions,
      impactQuestions: summary.impact_questions,
      riskQuestions: summary.risk_questions,
      returnQuestions: summary.return_questions,
    }));
  }, [sectorSummary]);

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
          isLoading={sectorSummaryLoading}
          error={sectorSummaryError}
          onRetry={() => dispatch(fetchSectorSummary() as any)}
        />
      )}
    </LayoutWrapper>
  );
};

export default QuestionsPage;
