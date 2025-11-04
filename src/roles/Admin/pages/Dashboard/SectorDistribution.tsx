import React from "react";

interface SectorData {
  name: string;
  percentage: number;
  count: number;
  color: string;
}

interface SectorDistributionProps {
  data: SectorData[];
}

const SectorDistribution: React.FC<SectorDistributionProps> = ({ data }) => {
  const centerX = 100;
  const centerY = 100;
  const outerRadius = 80;
  const innerRadius = 60;

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const renderDonutChart = () => {
    let currentAngle = 0;
    
    return data.map((sector, index) => {
      const startAngle = currentAngle;
      const endAngle = currentAngle + (sector.percentage / 100) * 360;
      const largeArcFlag = sector.percentage > 50 ? 1 : 0;
      
      const innerStart = polarToCartesian(centerX, centerY, innerRadius, startAngle);
      const innerEnd = polarToCartesian(centerX, centerY, innerRadius, endAngle);
      const outerStart = polarToCartesian(centerX, centerY, outerRadius, startAngle);
      const outerEnd = polarToCartesian(centerX, centerY, outerRadius, endAngle);
      
      const d = [
        `M ${outerStart.x} ${outerStart.y}`,
        `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerEnd.x} ${outerEnd.y}`,
        `L ${innerEnd.x} ${innerEnd.y}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStart.x} ${innerStart.y}`,
        `Z`,
      ].join(' ');

      currentAngle = endAngle;

      return (
        <path
          key={index}
          d={d}
          fill={sector.color}
          stroke="#F8F6F0"
          strokeWidth="2"
        />
      );
    });
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-1">Sector Distribution</h3>
      <p className="text-sm text-gray-600 mb-6">
        Breakdown of SPO's by Focus Area
      </p>
      
      <div className="flex items-center gap-8">
        <div className="relative flex-shrink-0">
          <svg width="200" height="200" viewBox="0 0 200 200">
            {renderDonutChart()}
            <circle cx="100" cy="100" r="60" fill="#F8F6F0" />
            <text x="100" y="95" textAnchor="middle" dominantBaseline="middle" fill="#1F2937" fontSize="14" fontWeight="600">
              {data[0]?.percentage || 0}%
            </text>
            <text x="100" y="110" textAnchor="middle" dominantBaseline="middle" fill="#6B7280" fontSize="12" fontWeight="500">
              {data[0]?.count || 0} SPOs
            </text>
          </svg>
        </div>
        
        <div className="flex-1 space-y-3">
          {data.map((sector, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: sector.color }} />
              <span className="text-sm font-medium text-gray-700">{sector.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SectorDistribution;

