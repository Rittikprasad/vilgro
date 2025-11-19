import React from 'react';
import DateRangeFilterModal, { type DateRangeFilters } from './DateRangeFilterModal';
import type { AdminSpoFilters } from '../../../features/adminSpo/adminSpoSlice';

interface SPOsFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: AdminSpoFilters) => void;
  currentFilters: AdminSpoFilters;
}

const SPOsFilterModal: React.FC<SPOsFilterModalProps> = ({
  isOpen,
  onClose,
  onApply,
  currentFilters,
}) => {
  const handleApply = (filters: DateRangeFilters) => {
    onApply(filters as AdminSpoFilters);
  };

  return (
    <DateRangeFilterModal
      isOpen={isOpen}
      onClose={onClose}
      onApply={handleApply}
      currentFilters={currentFilters}
      title="Filter SPOs"
    />
  );
};

export default SPOsFilterModal;

