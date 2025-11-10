import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

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
  const topSector = data[0];
  const pieData: Array<Record<string, number | string>> = data.map((sector) => ({
    name: sector.name,
    percentage: sector.percentage,
    count: sector.count,
    color: sector.color,
  }));

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-1">Sector Distribution</h3>
      <p className="text-[14px] font-[400] font-golos text-gray-400 mb-6">
        Breakdown of SPO's by Focus Area
      </p>
      
      {data.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center text-[13px] font-[400] font-golos text-gray-500">
          No sector data available.
        </div>
      ) : (
        <div className="flex items-center gap-8">
          <div className="relative flex-shrink-0 w-52 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="percentage"
                  nameKey="name"
                  innerRadius="60%"
                  outerRadius="100%"
                  stroke="#F8F6F0"
                  // strokeWidth={2}
                  // paddingAngle={2}
                >
                  {data.map((sector) => (
                    <Cell key={sector.name} fill={sector.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, _name: string, entry: any) => [
                    `${value}%`,
                    entry.payload.count ? `${entry.payload.count} SPOs` : entry.payload.name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center space-y-1">
              <span className="text-sm font-semibold text-gray-800">
                {topSector ? `${topSector.percentage}%` : "0%"}
              </span>
              <span className="text-xs font-medium text-gray-500">
                {topSector ? `${topSector.count} SPOs` : "0 SPOs"}
              </span>
            </div>
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
      )}
    </div>
  );
};

export default SectorDistribution;

