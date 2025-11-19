import React, { useState } from "react";
import { Button } from "../../../../components/ui/Button";
import DashboardFilterModal from "./DashboardFilterModal";
import type { DashboardFilters } from "../../../../features/adminDashboard/adminDashboardSlice";

interface DashboardHeaderProps {
  userName?: string;
  filterText?: string;
  onFilterChange?: (filters: DashboardFilters) => void;
  currentFilters?: DashboardFilters;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  userName = "John Doe", 
  filterText = "last 7 days",
  onFilterChange,
  currentFilters = {}
}) => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const hasActiveFilters = !!(currentFilters.start_date || currentFilters.end_date);

  const handleApplyFilters = (filters: DashboardFilters) => {
    onFilterChange?.(filters);
    setIsFilterModalOpen(false);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[30px] font-[500] font-[Baskervville] text-gray-800">Good Morning, {userName}</h1>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="px-4 py-2"
            onClick={() => setIsFilterModalOpen(true)}
          >
            Filters
          </Button>
          {hasActiveFilters ? (
            <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
              {filterText}
            </button>
          ) : (
            <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
              Filter: {filterText}
            </button>
          )}
        </div>
      </div>
      
      <DashboardFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilters}
        currentFilters={currentFilters}
      />
    </>
  );
};

export default DashboardHeader;

