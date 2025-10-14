import React, { useState } from 'react';
import { Button } from '../../../../components/ui/Button';
import { Card, CardContent } from '../../../../components/ui/Card';
import type { QuestionItem } from './QuestionListTable';

// Import custom question components
import SingleChoiceQuestion from '../../../../components/ui/question/SingleChoiceQuestion';
import MultipleChoiceQuestion from '../../../../components/ui/question/MultipleChoiceQuestion';
import SliderQuestion from '../../../../components/ui/question/SliderQuestion';
import StarRatingQuestion from '../../../../components/ui/question/StarRatingQuestion';
import VisualRatingQuestion from '../../../../components/ui/question/VisualRatingQuestion';
import SingleChoiceQuestionEditor from './SingleChoiceQuestionEditor';
import MultipleChoiceQuestionEditor from './MultipleChoiceQuestionEditor';
import SliderQuestionEditor from './SliderQuestionEditor';

interface EditQuestionsPageProps {
  questions: QuestionItem[];
  categoryTitle: string;
  onBackToQuestionList: () => void;
}

/**
 * EditQuestionsPage Component
 * Displays questions in editable format based on their types
 * This is the fourth level view, showing individual questions for editing
 */
const EditQuestionsPage: React.FC<EditQuestionsPageProps> = ({ 
  questions, 
  categoryTitle,
  onBackToQuestionList 
}) => {
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
  const [questionsList, setQuestionsList] = useState<QuestionItem[]>(questions);

  // Handle card click to enter edit mode
  const handleCardClick = (questionId: number) => {
    setEditingQuestionId(questionId);
  };

  // Handle saving edited question
  const handleSaveQuestion = (updatedQuestion: QuestionItem) => {
    setQuestionsList(questionsList.map(q => 
      q.order === updatedQuestion.order ? updatedQuestion : q
    ));
    setEditingQuestionId(null);
  };

  // Handle canceling edit mode
  const handleCancelEdit = () => {
    setEditingQuestionId(null);
  };

  // Render question based on type
  const renderQuestionComponent = (question: QuestionItem) => {
    const commonProps = {
      question: question.question,
      onChange: (answer: any) => {
        console.log(`Answer for question ${question.order}:`, answer);
      }
    };

    switch (question.type) {
      case 'Multi-select':
        if (question.options?.type === 'single-choice') {
          // Convert string array to {value, label} format
          const formattedOptions = question.options.choices.map((choice: string) => ({
            value: choice.toLowerCase().replace(/\s+/g, '_'),
            label: choice
          }));
          return (
            <SingleChoiceQuestion
              {...commonProps}
              options={formattedOptions}
            />
          );
        } else if (question.options?.type === 'multiple-choice') {
          // Convert string array to {value, label} format
          const formattedOptions = question.options.choices.map((choice: string) => ({
            value: choice.toLowerCase().replace(/\s+/g, '_'),
            label: choice
          }));
          return (
            <MultipleChoiceQuestion
              {...commonProps}
              options={formattedOptions}
            />
          );
        }
        break;

      case 'Slider':
      case 'Linear Scale':
        return (
          <SliderQuestion
            {...commonProps}
            value={0}
            min={question.options?.min || 0}
            max={question.options?.max || 100}
            step={question.options?.step || 1}
          />
        );

      case 'Rating Scale':
        return (
          <StarRatingQuestion
            {...commonProps}
            maxStars={question.options?.maxStars || 5}
            labels={question.options?.labels || []}
          />
        );

      case 'Smiley face':
        // Convert options to the format expected by VisualRatingQuestion
        const visualOptions = question.options?.options?.map((option: any) => ({
          value: option.value.toString(),
          emoji: option.emoji,
          label: option.label
        })) || [];
        return (
          <VisualRatingQuestion
            {...commonProps}
            options={visualOptions}
          />
        );

      case 'Checkbox':
        // Convert string array to {value, label} format
        const checkboxOptions = question.options?.choices?.map((choice: string) => ({
          value: choice.toLowerCase().replace(/\s+/g, '_'),
          label: choice
        })) || [];
        return (
          <MultipleChoiceQuestion
            {...commonProps}
            options={checkboxOptions}
          />
        );

      default:
        return (
          <div className="p-4 bg-gray-100 rounded-lg">
            <p className="text-gray-600">Question type "{question.type}" not supported</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={onBackToQuestionList}
            className="flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Questions List</span>
          </Button>
          <h1 
            className="text-gray-800"
            style={{
              fontFamily: 'Baskervville',
              fontWeight: 600,
              fontStyle: 'normal',
              fontSize: '40px'
            }}
          >
            Edit {categoryTitle} Questions
          </h1>
        </div>
        <Button 
          variant="gradient"
          className="px-6 py-3"
        >
          Publish
        </Button>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {questionsList.map((question) => (
          <div key={question.order}>
            {editingQuestionId === question.order ? (
              // Edit Mode - Show editor based on question type
              question.type === 'Multi-select' && question.options?.type === 'single-choice' ? (
                <SingleChoiceQuestionEditor
                  question={question}
                  onSave={handleSaveQuestion}
                  onCancel={handleCancelEdit}
                />
              ) : question.type === 'Multi-select' && question.options?.type === 'multiple-choice' ? (
                <MultipleChoiceQuestionEditor
                  question={question}
                  onSave={handleSaveQuestion}
                  onCancel={handleCancelEdit}
                />
              ) : question.type === 'Checkbox' ? (
                <MultipleChoiceQuestionEditor
                  question={question}
                  onSave={handleSaveQuestion}
                  onCancel={handleCancelEdit}
                />
              ) : question.type === 'Slider' || question.type === 'Linear Scale' ? (
                <SliderQuestionEditor
                  question={question}
                  onSave={handleSaveQuestion}
                  onCancel={handleCancelEdit}
                />
              ) : question.type === 'Rating Scale' ? (
                // Star Rating Editor - Coming Soon
                <Card className="p-6">
                  <CardContent className="p-0">
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">Star Rating Editor coming soon!</p>
                      <div className="flex justify-center space-x-3">
                        <Button
                          variant="outline"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="gradient"
                          onClick={handleCancelEdit}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : question.type === 'Smiley face' ? (
                // Visual Rating Editor - Coming Soon
                <Card className="p-6">
                  <CardContent className="p-0">
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">Visual Rating Editor coming soon!</p>
                      <div className="flex justify-center space-x-3">
                        <Button
                          variant="outline"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="gradient"
                          onClick={handleCancelEdit}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                // For other question types, show placeholder for now
                <Card className="p-6">
                  <CardContent className="p-0">
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">Editor for "{question.type}" questions coming soon!</p>
                      <div className="flex justify-center space-x-3">
                        <Button
                          variant="outline"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="gradient"
                          onClick={handleCancelEdit}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            ) : (
              // View Mode - Show question card
              <Card 
                key={question.order} 
                className="p-6 cursor-pointer hover:shadow-md transition-shadow duration-200"
                onClick={() => handleCardClick(question.order)}
              >
                <CardContent className="p-0">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span 
                        className="text-sm font-medium text-gray-500"
                        style={{
                          fontFamily: 'Golos Text',
                          fontWeight: 400,
                          fontStyle: 'normal',
                          fontSize: '14px'
                        }}
                      >
                        Question {question.order}
                      </span>
                      <span 
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                        style={{
                          fontFamily: 'Golos Text',
                          fontWeight: 400,
                          fontStyle: 'normal',
                          fontSize: '12px'
                        }}
                      >
                        {question.type}
                      </span>
                    </div>
                    <h3 
                      className="text-lg font-medium text-gray-800 mb-4"
                      style={{
                        fontFamily: 'Golos Text',
                        fontWeight: 500,
                        fontStyle: 'normal',
                        fontSize: '18px'
                      }}
                    >
                      {question.question}
                    </h3>
                  </div>
                  
                  {/* Render the appropriate question component */}
                  <div className="mt-4">
                    {renderQuestionComponent(question)}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ))}
      </div>

      {/* Add Question Button */}
      <div className="flex justify-center pt-6">
        <Button 
          variant="outline"
          className="flex items-center space-x-2 px-6 py-3 border-2 border-gray-300 hover:border-gray-400"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Add Question</span>
        </Button>
      </div>
    </div>
  );
};

export default EditQuestionsPage;
