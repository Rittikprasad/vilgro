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
  const [localSectors, setLocalSectors] = useState<QuestionCategory[]>([]);

  // Fetch sector summary on component mount
  useEffect(() => {
    dispatch(fetchSectorSummary() as any);
  }, [dispatch]);

  // Transform API response to QuestionCategory format
  const questionCategories: QuestionCategory[] = useMemo(() => {
    const apiCategories = (sectorSummary || []).map((summary) => ({
      id: summary.sector.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-'),
      title: summary.sector,
      totalQuestions: summary.total_questions,
      impactQuestions: summary.impact_questions,
      riskQuestions: summary.risk_questions,
      returnQuestions: summary.return_questions,
    }));
    
    // Merge with locally added sectors (for UI readiness, API integration later)
    return [...apiCategories, ...localSectors];
  }, [sectorSummary, localSectors]);

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

  // Handle adding a new sector
  const handleAddSector = async (sectorName: string) => {
    // TODO: API Integration - Call API to create new sector
    // For now, add to local state for UI readiness
    const newSector: QuestionCategory = {
      id: sectorName.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-'),
      title: sectorName,
      totalQuestions: 0,
      impactQuestions: 0,
      riskQuestions: 0,
      returnQuestions: 0,
    };
    
    setLocalSectors((prev) => [...prev, newSector]);
    
    // After API integration, you would:
    // 1. Call the API to create the sector
    // 2. Refresh the sector summary list
    // 3. Remove local state management
    // Example:
    // await dispatch(createSector({ name: sectorName }));
    // dispatch(fetchSectorSummary() as any);
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
          onAddSector={handleAddSector}
        />
      )}
    </LayoutWrapper>
  );
};

export default QuestionsPage;
