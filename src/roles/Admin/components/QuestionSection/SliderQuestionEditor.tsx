import React, { useState } from 'react';
import { Button } from '../../../../components/ui/Button';
import { Card, CardContent } from '../../../../components/ui/Card';
import type { QuestionItem } from './QuestionListTable';

interface SliderQuestionEditorProps {
  question: QuestionItem;
  onSave: (updatedQuestion: QuestionItem) => void;
  onCancel: () => void;
  onDelete?: (questionId: number) => void;
  isLoading?: boolean;
}

const SliderQuestionEditor: React.FC<SliderQuestionEditorProps> = ({
  question,
  onSave,
  onCancel,
  onDelete,
  isLoading = false
}) => {
  const isMultiSlider = question.type === 'MULTI_SLIDER' || question.type === 'Multi-Slider';
  
  // For single slider
  const [questionText, setQuestionText] = useState(question.question);
  const [minValue, setMinValue] = useState(question.options?.min || 0);
  const [maxValue, setMaxValue] = useState(question.options?.max || 100);
  const [stepValue, setStepValue] = useState(question.options?.step || 1);
  const [pointsPerUnit, setPointsPerUnit] = useState(question.options?.pointsPerUnit || 1);
  const [dimensionCode, setDimensionCode] = useState(question.options?.dimensionCode || 'slider');
  const [dimensionLabel, setDimensionLabel] = useState(question.options?.dimensionLabel || 'Slider');
  const [weightage, setWeightage] = useState(question.weight);
  const [order, setOrder] = useState(question.order);
  const [isActive, setIsActive] = useState(question.status === 'Active');

  // For multi-slider - manage dimensions array
  const [dimensions, setDimensions] = useState(() => {
    if (isMultiSlider && question.options?.dimensions) {
      return question.options.dimensions;
    }
    // Default dimensions for new multi-slider
    return [
      { code: 'dimension1', label: 'Dimension 1', min_value: 0, max_value: 100, points_per_unit: 1, weight: 1 },
      { code: 'dimension2', label: 'Dimension 2', min_value: 0, max_value: 100, points_per_unit: 1, weight: 1 }
    ];
  });

  // Helper functions for multi-slider dimensions
  const updateDimension = (index: number, field: string, value: any) => {
    setDimensions((prev: any[]) => prev.map((dim: any, i: number) => 
      i === index ? { ...dim, [field]: value } : dim
    ));
  };

  const handleSave = () => {
    const updatedQuestion: QuestionItem = {
      ...question,
      question: questionText,
      weight: weightage,
      order: order,
      status: isActive ? 'Active' : 'Inactive',
      options: isMultiSlider ? {
        dimensions: dimensions
      } : {
        min: minValue,
        max: maxValue,
        step: stepValue,
        pointsPerUnit: pointsPerUnit,
        dimensionCode: dimensionCode,
        dimensionLabel: dimensionLabel
      }
    };
    onSave(updatedQuestion);
  };

  return (
    <Card className="p-6">
      <CardContent className="p-0">
        {/* Question Text Input */}
        <div className="mb-6">
          <input
            type="text"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            className="w-full p-3 border-b-2 border-gray-200 focus:border-green-500 focus:outline-none bg-gray-50 rounded-t-lg"
            placeholder="Enter question text..."
          />
        </div>

        {/* Slider Configuration */}
        <div className="space-y-4 mb-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 
              className="text-sm font-medium text-gray-700 mb-4"
              style={{
                fontFamily: 'Golos Text',
                fontWeight: 500,
                fontStyle: 'normal',
                fontSize: '14px'
              }}
            >
              {isMultiSlider ? 'Multi-Slider Configuration' : 'Slider Configuration'}
            </h4>
            
            {isMultiSlider ? (
              /* Multi-Slider Configuration */
              <div className="space-y-6">
                {dimensions.map((dimension: any, index: number) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <h5 className="text-sm font-medium text-gray-600 mb-3">
                      Dimension {index + 1}
                    </h5>
                    <div className="grid grid-cols-2 gap-4">
                      {/* Dimension Code */}
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Dimension Code *
                        </label>
                        <input
                          type="text"
                          value={dimension.code}
                          onChange={(e) => updateDimension(index, 'code', e.target.value)}
                          className="w-full p-2 border border-gray-200 rounded focus:border-green-500 focus:outline-none"
                          placeholder="e.g., quality, speed"
                          required
                        />
                      </div>

                      {/* Dimension Label */}
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Dimension Label *
                        </label>
                        <input
                          type="text"
                          value={dimension.label}
                          onChange={(e) => updateDimension(index, 'label', e.target.value)}
                          className="w-full p-2 border border-gray-200 rounded focus:border-green-500 focus:outline-none"
                          placeholder="e.g., Quality Rating, Speed Score"
                          required
                        />
                      </div>

                      {/* Min Value */}
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Min Value
                        </label>
                        <input
                          type="number"
                          value={dimension.min_value}
                          onChange={(e) => updateDimension(index, 'min_value', parseInt(e.target.value) || 0)}
                          className="w-full p-2 border border-gray-200 rounded focus:border-green-500 focus:outline-none"
                        />
                      </div>

                      {/* Max Value */}
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Max Value
                        </label>
                        <input
                          type="number"
                          value={dimension.max_value}
                          onChange={(e) => updateDimension(index, 'max_value', parseInt(e.target.value) || 100)}
                          className="w-full p-2 border border-gray-200 rounded focus:border-green-500 focus:outline-none"
                        />
                      </div>

                      {/* Points Per Unit */}
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Points Per Unit
                        </label>
                        <input
                          type="number"
                          value={dimension.points_per_unit}
                          onChange={(e) => updateDimension(index, 'points_per_unit', parseInt(e.target.value) || 1)}
                          className="w-full p-2 border border-gray-200 rounded focus:border-green-500 focus:outline-none"
                          min="1"
                        />
                      </div>

                      {/* Weight */}
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Weight
                        </label>
                        <input
                          type="number"
                          value={dimension.weight}
                          onChange={(e) => updateDimension(index, 'weight', parseInt(e.target.value) || 1)}
                          className="w-full p-2 border border-gray-200 rounded focus:border-green-500 focus:outline-none"
                          min="1"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Single Slider Configuration */
              <div className="grid grid-cols-2 gap-4">
                {/* Dimension Code */}
                <div>
                  <label 
                    className="block text-sm font-medium text-gray-600 mb-2"
                    style={{
                      fontFamily: 'Golos Text',
                      fontWeight: 400,
                      fontStyle: 'normal',
                      fontSize: '12px'
                    }}
                  >
                    Dimension Code *
                  </label>
                  <input
                    type="text"
                    value={dimensionCode}
                    onChange={(e) => setDimensionCode(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded focus:border-green-500 focus:outline-none"
                    placeholder="e.g., quality, speed, price"
                    required
                  />
                </div>

                {/* Dimension Label */}
                <div>
                  <label 
                    className="block text-sm font-medium text-gray-600 mb-2"
                    style={{
                      fontFamily: 'Golos Text',
                      fontWeight: 400,
                      fontStyle: 'normal',
                      fontSize: '12px'
                    }}
                  >
                    Dimension Label *
                  </label>
                  <input
                    type="text"
                    value={dimensionLabel}
                    onChange={(e) => setDimensionLabel(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded focus:border-green-500 focus:outline-none"
                    placeholder="e.g., Quality Rating, Speed Score"
                    required
                  />
                </div>

                {/* Minimum Value */}
                <div>
                  <label 
                    className="block text-sm font-medium text-gray-600 mb-2"
                    style={{
                      fontFamily: 'Golos Text',
                      fontWeight: 400,
                      fontStyle: 'normal',
                      fontSize: '12px'
                    }}
                  >
                    Minimum Value
                  </label>
                  <input
                    type="number"
                    value={minValue}
                    onChange={(e) => setMinValue(parseInt(e.target.value) || 0)}
                    className="w-full p-2 border border-gray-200 rounded focus:border-green-500 focus:outline-none"
                  />
                </div>

                {/* Maximum Value */}
                <div>
                  <label 
                    className="block text-sm font-medium text-gray-600 mb-2"
                    style={{
                      fontFamily: 'Golos Text',
                      fontWeight: 400,
                      fontStyle: 'normal',
                      fontSize: '12px'
                    }}
                  >
                    Maximum Value
                  </label>
                  <input
                    type="number"
                    value={maxValue}
                    onChange={(e) => setMaxValue(parseInt(e.target.value) || 100)}
                    className="w-full p-2 border border-gray-200 rounded focus:border-green-500 focus:outline-none"
                  />
                </div>

                {/* Step Value */}
                <div>
                  <label 
                    className="block text-sm font-medium text-gray-600 mb-2"
                    style={{
                      fontFamily: 'Golos Text',
                      fontWeight: 400,
                      fontStyle: 'normal',
                      fontSize: '12px'
                    }}
                  >
                    Step Value
                  </label>
                  <input
                    type="number"
                    value={stepValue}
                    onChange={(e) => setStepValue(parseInt(e.target.value) || 1)}
                    className="w-full p-2 border border-gray-200 rounded focus:border-green-500 focus:outline-none"
                    min="1"
                  />
                </div>

                {/* Points Per Unit */}
                <div>
                  <label 
                    className="block text-sm font-medium text-gray-600 mb-2"
                    style={{
                      fontFamily: 'Golos Text',
                      fontWeight: 400,
                      fontStyle: 'normal',
                      fontSize: '12px'
                    }}
                  >
                    Points Per Unit
                  </label>
                  <input
                    type="number"
                    value={pointsPerUnit}
                    onChange={(e) => setPointsPerUnit(parseInt(e.target.value) || 1)}
                    className="w-full p-2 border border-gray-200 rounded focus:border-green-500 focus:outline-none"
                    min="1"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <hr className="mb-6" />

        {/* Bottom Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Order */}
            <div className="flex items-center space-x-2">
              <label 
                className="text-sm font-medium text-gray-700"
                style={{
                  fontFamily: 'Golos Text',
                  fontWeight: 400,
                  fontStyle: 'normal',
                  fontSize: '14px'
                }}
              >
                Order:
              </label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value) || 1)}
                className="w-16 p-2 border border-gray-200 rounded focus:border-green-500 focus:outline-none text-center"
                min="1"
              />
            </div>

            {/* Weightage */}
            <div className="flex items-center space-x-2">
              <label 
                className="text-sm font-medium text-gray-700"
                style={{
                  fontFamily: 'Golos Text',
                  fontWeight: 400,
                  fontStyle: 'normal',
                  fontSize: '14px'
                }}
              >
                Weightage:
              </label>
              <input
                type="number"
                value={weightage}
                onChange={(e) => setWeightage(parseInt(e.target.value) || 1)}
                className="w-16 p-2 border border-gray-200 rounded focus:border-green-500 focus:outline-none text-center"
                min="1"
                max="10"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Active Toggle */}
            <div className="flex items-center space-x-2">
              <label 
                className="text-sm font-medium text-gray-700"
                style={{
                  fontFamily: 'Golos Text',
                  fontWeight: 400,
                  fontStyle: 'normal',
                  fontSize: '14px'
                }}
              >
                Active:
              </label>
              <button
                onClick={() => setIsActive(!isActive)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isActive ? 'bg-green-500' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isActive ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Delete Question */}
            <button 
              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(question.id);
              }}
              disabled={!onDelete || isLoading}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Save/Cancel Buttons */}
        <div className="flex justify-end space-x-3 mt-6">
          <Button
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            variant="gradient"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SliderQuestionEditor;
