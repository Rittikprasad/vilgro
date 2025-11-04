import React from "react";

interface FunnelStep {
  label: string;
  count: number;
  percentage: number;
}

interface AssessmentFunnelProps {
  data: FunnelStep[];
}

const AssessmentFunnel: React.FC<AssessmentFunnelProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-1">
        Assessment Completion Funnel
      </h3>
      <p className="text-sm text-gray-600 mb-6">
        Track where SPO's drop off during the assessment process
      </p>
      
      <div className="space-y-4">
        {data.map((step, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex-1 mr-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">{step.label}</span>
                <span className="text-sm font-semibold text-gray-900">{step.count}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${step.percentage}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssessmentFunnel;

