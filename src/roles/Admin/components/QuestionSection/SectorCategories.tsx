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
}

/**
 * SectorCategories Component
 * Displays the main list of question categories (Agriculture, Health, etc.)
 * This is the first level view showing sectors in which organizations work
 */
const SectorCategories: React.FC<SectorCategoriesProps> = ({ 
  categories, 
  onCategorySelect 
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
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
          List of Questions
        </h1>
      </div>

      {/* Question Categories Grid */}
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
                  fontSize: '16px'
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
                    fontSize: '12px'
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
                    fontSize: '12px'
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
                    fontSize: '12px'
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
                    fontSize: '12px'
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
                View all Questions
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SectorCategories;
