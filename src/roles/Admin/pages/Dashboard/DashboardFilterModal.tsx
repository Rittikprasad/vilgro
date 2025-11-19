import React from 'react';
import DateRangeFilterModal, { type DateRangeFilters } from '../../components/DateRangeFilterModal';
import type { DashboardFilters } from '../../../../features/adminDashboard/adminDashboardSlice';

interface DashboardFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: DashboardFilters) => void;
  currentFilters: DashboardFilters;
}

const DashboardFilterModal: React.FC<DashboardFilterModalProps> = ({
  isOpen,
  onClose,
  onApply,
  currentFilters,
}) => {
  const handleApply = (filters: DateRangeFilters) => {
    onApply(filters as DashboardFilters);
  };

  return (
    <DateRangeFilterModal
      isOpen={isOpen}
      onClose={onClose}
      onApply={handleApply}
      currentFilters={currentFilters}
      title="Filter Dashboard"
    />
  );
};

export default DashboardFilterModal;

