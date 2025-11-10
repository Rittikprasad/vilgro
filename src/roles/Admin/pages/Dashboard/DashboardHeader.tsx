import React from "react";

interface DashboardHeaderProps {
  userName?: string;
  filterText?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  userName = "John Doe", 
  filterText = "last 7 days" 
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-[30px] font-[500] font-[Baskervville] text-gray-800">Good Morning, {userName}</h1>
       
      </div>
      <button className="mt-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
          Filter: {filterText}
        </button>
    </div>
  );
};

export default DashboardHeader;

