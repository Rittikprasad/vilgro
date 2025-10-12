import React from "react";

interface SliderQuestionProps {
  question: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

const SliderQuestion: React.FC<SliderQuestionProps> = ({ question, value, onChange }) => {
  const ticks = Array.from({ length: 9 }, (_, i) => (i + 1) * 10); // 10 → 90 (excluding 0 and 100)
  const allLabels = Array.from({ length: 11 }, (_, i) => i * 10); // 0 → 100 (for labels)

  return (
    <div className="w-full space-y-3">
      {/* Question */}
      <p className="text-green-600 font-medium">{question}</p>

      {/* Value Display */}
      <div className="text-2xl font-bold">{value}%</div>

      {/* Slider with custom ticks */}
      <div className="relative w-full">
        {/* Track background */}
        <div className="absolute top-1/2 left-0 w-full h-4 bg-gray-200 rounded-full -translate-y-1/2" />

        {/* Track fill */}
        <div
          className="absolute top-1/2 left-0 h-4 bg-green-500 rounded-full -translate-y-1/2"
          style={{ width: `${value}%` }}
        />

        {/* Tick marks */}
        {ticks.map((tick) => (
          <div
            key={tick}
            className="absolute top-1/2 w-px h-4 bg-black -translate-y-1/2"
            style={{ left: `${tick}%` }}
          />
        ))}

        {/* Input slider (transparent, only thumb visible) */}
        <input
          type="range"
          min={0}
          max={100}
          step={5}
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
        {allLabels.map((label) => (
          <span
            key={label}
            className="absolute text-xs text-gray-500 -translate-x-1/2"
            style={{ left: `${label}%` }}
          >
            {label}%
          </span>
        ))}
      </div>
    </div>
  );
};

export default SliderQuestion;
