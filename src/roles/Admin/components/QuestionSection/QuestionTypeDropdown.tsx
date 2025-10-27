import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../../../../components/ui/Button';
import type { QuestionType } from '../../../../services/adminApi';

interface QuestionTypeDropdownProps {
  questionTypes: QuestionType[];
  onSelectType: (questionType: QuestionType) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

const QuestionTypeDropdown: React.FC<QuestionTypeDropdownProps> = ({
  questionTypes,
  onSelectType,
  isLoading = false,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<QuestionType | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleTypeSelect = (questionType: QuestionType) => {
    setSelectedType(questionType);
    setIsOpen(false);
    onSelectType(questionType);
  };

  const toggleDropdown = () => {
    if (!disabled && !isLoading) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        onClick={toggleDropdown}
        disabled={disabled || isLoading}
        className="flex items-center space-x-2 px-6 py-3 border-2 border-gray-300 hover:border-gray-400 min-w-[200px] justify-between"
      >
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>
            {isLoading ? 'Loading...' : selectedType ? selectedType.label : 'Add Question'}
          </span>
        </div>
        <svg 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {questionTypes.length > 0 ? (
            questionTypes.map((questionType) => (
              <button
                key={questionType.value}
                onClick={() => handleTypeSelect(questionType)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span 
                    className="text-gray-800"
                    style={{
                      fontFamily: 'Golos Text',
                      fontWeight: 400,
                      fontStyle: 'normal',
                      fontSize: '14px'
                    }}
                  >
                    {questionType.label}
                  </span>
                </div>
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-gray-500 text-center">
              No question types available
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionTypeDropdown;