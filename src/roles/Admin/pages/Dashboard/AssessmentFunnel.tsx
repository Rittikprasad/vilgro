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
      <h3 className="text-[16px] font-[500] font-golos text-gray-900 mb-1">
        Assessment Completion Funnel
      </h3>
      <p className="text-[14px] font-[400] font-golos text-gray-400 mb-6">
        Track where SPO's drop off during the assessment process
      </p>
      
      {data.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center text-[13px] font-[400] font-golos text-gray-500">
          No funnel data available.
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((step, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex-1 mr-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] font-[400] font-golos text-gray-600">{step.label}</span>
                  <span className="text-[14px] font-[500] font-golos text-gray-900">{step.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-[#46b753] h-3 rounded-full transition-all duration-500"
                    style={{ width: `${step.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssessmentFunnel;

