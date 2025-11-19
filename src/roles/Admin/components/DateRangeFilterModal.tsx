import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card, CardContent, CardHeader } from '../../../components/ui/Card';
import { cn } from '../../../lib/utils';

export interface DateRangeFilters {
  start_date?: string;
  end_date?: string;
}

interface DateRangeFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: DateRangeFilters) => void;
  currentFilters: DateRangeFilters;
  title?: string;
}

const DateRangeFilterModal: React.FC<DateRangeFilterModalProps> = ({
  isOpen,
  onClose,
  onApply,
  currentFilters,
  title = "Filter",
}) => {
  const [startDate, setStartDate] = useState(currentFilters.start_date || '');
  const [endDate, setEndDate] = useState(currentFilters.end_date || '');

  // Update local state when currentFilters change
  useEffect(() => {
    setStartDate(currentFilters.start_date || '');
    setEndDate(currentFilters.end_date || '');
  }, [currentFilters]);

  const handleApply = () => {
    const filters: DateRangeFilters = {};
    
    if (startDate) filters.start_date = startDate;
    if (endDate) filters.end_date = endDate;
    
    onApply(filters);
    onClose();
  };

  const handleClear = () => {
    setStartDate('');
    setEndDate('');
    onApply({});
    onClose();
  };

  const hasActiveFilters = startDate || endDate;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <h2 className="text-[20px] font-[600] text-gray-900 font-golos">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Date Range */}
          <div className="space-y-4">
            <label className="block text-[14px] font-[400] text-gray-700 font-golos">
              Date Range
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[12px] font-[400] text-gray-600 font-golos">
                  Start Date
                </label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={cn(
                    "w-full h-11 px-4 py-3 rounded-lg focus:outline-none focus:ring-0 focus:border-transparent transition-colors bg-[#F5F5F5]",
                    "gradient-border"
                  )}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[12px] font-[400] text-gray-600 font-golos">
                  End Date
                </label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  className={cn(
                    "w-full h-11 px-4 py-3 rounded-lg focus:outline-none focus:ring-0 focus:border-transparent transition-colors bg-[#F5F5F5]",
                    "gradient-border"
                  )}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={handleClear}
              disabled={!hasActiveFilters}
            >
              Clear All
            </Button>
            <Button variant="gradient" onClick={handleApply}>
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DateRangeFilterModal;

