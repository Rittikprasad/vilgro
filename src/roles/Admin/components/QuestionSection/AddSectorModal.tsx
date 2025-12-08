import React, { useState } from 'react';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';

interface AddSectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSector: (sectorName: string) => void;
  isAdding?: boolean;
  error?: string | null;
}

const AddSectorModal: React.FC<AddSectorModalProps> = ({
  isOpen,
  onClose,
  onAddSector,
  isAdding = false,
  error = null,
}) => {
  const [sectorName, setSectorName] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!sectorName.trim()) {
      setValidationError('Sector name is required');
      return;
    }

    if (sectorName.trim().length < 2) {
      setValidationError('Sector name must be at least 2 characters');
      return;
    }

    setValidationError(null);
    onAddSector(sectorName.trim());
  };

  const handleClose = () => {
    setSectorName('');
    setValidationError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 
            className="text-gray-800"
            style={{
              fontFamily: 'Baskervville',
              fontWeight: 600,
              fontStyle: 'normal',
              fontSize: '24px'
            }}
          >
            Add New Sector
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isAdding}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Error Messages */}
        {(error || validationError) && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error || validationError}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label 
              htmlFor="sector-name"
              className="block text-sm font-medium text-gray-700 mb-2"
              style={{
                fontFamily: 'Golos Text',
                fontWeight: 400,
                fontStyle: 'normal',
                fontSize: '14px'
              }}
            >
              Sector Name *
            </label>
            <Input
              id="sector-name"
              type="text"
              value={sectorName}
              onChange={(e) => {
                setSectorName(e.target.value);
                setValidationError(null);
              }}
              placeholder="e.g., Agriculture, Healthcare, Education"
              className="w-full"
              disabled={isAdding}
              autoFocus
            />
            <p className="mt-1 text-xs text-gray-500">
              Enter the name of the new sector
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isAdding}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="gradient"
              disabled={isAdding || !sectorName.trim()}
            >
              {isAdding ? 'Adding...' : 'Add Sector'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSectorModal;

