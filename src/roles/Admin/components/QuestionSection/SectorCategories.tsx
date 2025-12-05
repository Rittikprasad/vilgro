import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';

// Types for the question categories
export interface QuestionCategory {
  id: string;
  title: string;
  totalQuestions: number;
  impactQuestions: number;
  riskQuestions: number;
  returnQuestions: number;
}

interface SectorCategoriesProps {
  categories: QuestionCategory[];
  onCategorySelect: (categoryId: string) => void;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

/**
 * SectorCategories Component
 * Displays the main list of question categories (Agriculture, Health, etc.)
 * This is the first level view showing sectors in which organizations work
 */
const SectorCategories: React.FC<SectorCategoriesProps> = ({ 
  categories, 
  onCategorySelect,
  isLoading = false,
  error = null,
  onRetry
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 
          className="text-gray-800"
          style={{
            fontFamily: 'Baskervville',
            fontWeight: 500,
            fontStyle: 'normal',
            fontSize: '30px'
          }}
        >
          List of Questions
        </h1>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading sectors...</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          {onRetry && (
            <Button
              variant="outline"
              onClick={onRetry}
            >
              Retry
            </Button>
          )}
        </div>
      )}

      {/* Question Categories Grid */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="hover:shadow-md transition-shadow duration-200">
            <CardHeader>
              <h3 
                className="text-gray-800"
                style={{
                  fontFamily: 'Golos Text',
                  fontWeight: 500,
                  fontStyle: 'normal',
                  fontSize: '18px'
                }}
              >
                {category.title}
              </h3>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <p 
                  className="text-gray-800"
                  style={{
                    fontFamily: 'Golos Text',
                    fontWeight: 600,
                    fontStyle: 'normal',
                    fontSize: '14px'
                  }}
                >
                  Total Questions: {category.totalQuestions}
                </p>
                <p 
                  className="text-gray-600"
                  style={{
                    fontFamily: 'Golos Text',
                    fontWeight: 400,
                    fontStyle: 'normal',
                    fontSize: '14px'
                  }}
                >
                  Impact Questions: {category.impactQuestions}
                </p>
                <p 
                  className="text-gray-600"
                  style={{
                    fontFamily: 'Golos Text',
                    fontWeight: 400,
                    fontStyle: 'normal',
                    fontSize: '14px'
                  }}
                >
                  Risk Questions: {category.riskQuestions}
                </p>
                <p 
                  className="text-gray-600"
                  style={{
                    fontFamily: 'Golos Text',
                    fontWeight: 400,
                    fontStyle: 'normal',
                    fontSize: '14px'
                  }}
                >
                  Return Questions: {category.returnQuestions}
                </p>
              </div>
            </CardContent>

            <CardFooter>
              <Button 
                variant="gradient" 
                className="w-full"
                onClick={() => onCategorySelect(category.id)}
              >
                Next
              </Button>
            </CardFooter>
          </Card>
        ))}
        </div>
      )}

      {/* No categories available */}
      {!isLoading && !error && categories.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">No sectors available</p>
        </div>
      )}
    </div>
  );
};

export default SectorCategories;
