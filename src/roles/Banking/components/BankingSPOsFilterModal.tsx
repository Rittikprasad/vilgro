import React from 'react';
import DateRangeFilterModal, { type DateRangeFilters } from '../../Admin/components/DateRangeFilterModal';
import type { BankingSpoFilters } from '../../../features/bankingSpo/bankingSpoSlice';

interface BankingSPOsFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: BankingSpoFilters) => void;
  currentFilters: BankingSpoFilters;
}

const BankingSPOsFilterModal: React.FC<BankingSPOsFilterModalProps> = ({
  isOpen,
  onClose,
  onApply,
  currentFilters,
}) => {
  const handleApply = (filters: DateRangeFilters) => {
    onApply(filters as BankingSpoFilters);
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

export default BankingSPOsFilterModal;

