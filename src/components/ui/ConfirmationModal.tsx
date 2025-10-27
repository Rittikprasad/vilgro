import React from 'react';
import { Button } from './Button';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Yes',
  cancelText = 'No',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 border border-gray-200">
        {/* Title */}
        <h2 
          className="text-lg font-bold text-gray-900 mb-4"
          style={{
            fontFamily: 'Golos Text',
            fontWeight: 600,
            fontStyle: 'normal',
            fontSize: '18px'
          }}
        >
          {title}
        </h2>
        
        {/* Message */}
        <p 
          className="text-gray-600 mb-6"
          style={{
            fontFamily: 'Golos Text',
            fontWeight: 400,
            fontStyle: 'normal',
            fontSize: '14px'
          }}
        >
          {message}
        </p>
        
        {/* Buttons */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg font-medium text-white transition-all"
            style={{
              background: 'linear-gradient(92deg, #46B753 0.02%, #E0DC32 100.02%)',
              fontFamily: 'Golos Text',
              fontWeight: 500,
              fontSize: '14px',
              minWidth: '80px'
            }}
          >
            {confirmText}
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg font-medium text-gray-900 bg-white border-2 transition-all hover:bg-gray-50"
            style={{
              borderColor: '#E0DC32',
              fontFamily: 'Golos Text',
              fontWeight: 500,
              fontSize: '14px',
              minWidth: '80px'
            }}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

