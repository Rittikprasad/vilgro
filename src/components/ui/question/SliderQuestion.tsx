import React from "react";

interface SliderQuestionProps {
  question: string;
  questionNumber?: number;
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

const SliderQuestion: React.FC<SliderQuestionProps> = ({ question, questionNumber, min = 0, max = 100, step = 1, value, onChange }) => {
  console.log(question, min, max, step, "lololollolo");
  
  // Calculate the range and percentage for display
  const range = max - min;
  const percentage = ((value - min) / range) * 100;
  
  // Generate ticks based on actual min/max range
  const tickCount = 9; // Number of tick marks
  const tickStep = range / (tickCount + 1);
  const ticks = Array.from({ length: tickCount }, (_, i) => min + (i + 1) * tickStep);
  
  // Generate labels for display
  const labelCount = 11; // Number of labels
  const labelStep = range / (labelCount - 1);
  const labels = Array.from({ length: labelCount }, (_, i) => min + i * labelStep);

  return (
    <div className="w-full space-y-7 pl-3 pr-3">
      {/* Question */}
      <p className="text-[#46B753] font-golos font-medium text-[18px] font-[500]">
        {questionNumber !== undefined && `${questionNumber}. `}{question}
      </p>

      {/* Value Display */}
      <div className="text-[25px] font-[600] font-golos">{value}</div>

      {/* Slider with custom ticks */}
      <div className="relative w-full">
        {/* Track background */}
        <div className="absolute top-1/2 left-0 w-full h-4 bg-gray-200 rounded-full -translate-y-1/2" />

        {/* Track fill */}
        <div
          className="absolute top-1/2 left-0 h-4 bg-green-500 rounded-full -translate-y-1/2"
          style={{ width: `${percentage}%` }}
        />

        {/* Tick marks */}
        {ticks.map((tick) => {
          const tickPercentage = ((tick - min) / range) * 100;
          return (
            <div
              key={tick}
              className="absolute top-1/2 w-px h-4 bg-black -translate-y-1/2"
              style={{ left: `${tickPercentage}%` }}
            />
          );
        })}

        {/* Input slider (transparent, only thumb visible) */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="
            relative w-full h-2 appearance-none bg-transparent cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none 
            [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-green-500
            [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4
            [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white
            [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-green-500
          "
        />
      </div>

      {/* Labels aligned with all positions */}
      <div className="relative w-full">
        {labels.map((label) => {
          const labelPercentage = ((label - min) / range) * 100;
          return (
            <span
              key={label}
              className="absolute text-xs text-gray-500 -translate-x-1/2"
              style={{ left: `${labelPercentage}%` }}
            >
              {label}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default SliderQuestion;
