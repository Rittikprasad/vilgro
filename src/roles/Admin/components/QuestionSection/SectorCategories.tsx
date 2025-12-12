import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import AddSectorModal from './AddSectorModal';
import ConfirmationModal from '../../../../components/ui/ConfirmationModal';
import { useDispatch } from 'react-redux';
import { editSector, deleteSector, fetchSectorSummary } from '../../../../features/question-builder/questionBuilderSlice';

// Types for the question categories
export interface QuestionCategory {
  id: string;
  title: string;
  totalQuestions: number;
  impactQuestions: number;
  riskQuestions: number;
  returnQuestions: number;
}

interface SectorCategoriesProps {
  categories: QuestionCategory[];
  onCategorySelect: (categoryId: string) => void;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onAddSector?: (sectorName: string) => void;
  addSectorError?: string | null;
  onSectorUpdated?: () => void;
}

/**
 * SectorCategories Component
 * Displays the main list of question categories (Agriculture, Health, etc.)
 * This is the first level view showing sectors in which organizations work
 */
const SectorCategories: React.FC<SectorCategoriesProps> = ({ 
  categories, 
  onCategorySelect,
  isLoading = false,
  error = null,
  onRetry,
  onAddSector,
  addSectorError = null,
  onSectorUpdated
}) => {
  const dispatch = useDispatch();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSector, setSelectedSector] = useState<QuestionCategory | null>(null);
  const [sectorError, setSectorError] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.menu-container')) {
        setOpenMenuId(null);
      }
    };

    if (openMenuId) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [openMenuId]);

  const handleAddSector = async (sectorName: string) => {
    if (!onAddSector) return;
    
    setIsAdding(true);
    try {
      await onAddSector(sectorName);
      // Close modal on success - error handling is done in parent
      setIsAddModalOpen(false);
    } catch (err) {
      console.error('Failed to add sector:', err);
      // Error will be displayed in the modal via addSectorError prop
      // Don't close modal on error so user can see the error message
    } finally {
      setIsAdding(false);
    }
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setSectorError(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedSector(null);
    setSectorError(null);
  };

  const handleEditSector = (sector: QuestionCategory) => {
    setSelectedSector(sector);
    setIsEditModalOpen(true);
    setSectorError(null);
  };

  const handleDeleteClick = (sector: QuestionCategory) => {
    setSelectedSector(sector);
    setIsDeleteModalOpen(true);
  };

  const handleEditSectorSubmit = async (newSectorName: string) => {
    if (!selectedSector) return;
    
    setIsAdding(true);
    setSectorError(null);
    try {
      const result = await dispatch(editSector({
        oldName: selectedSector.title,
        newName: newSectorName
      }) as any);
      
      if (editSector.fulfilled.match(result)) {
        setIsEditModalOpen(false);
        setSelectedSector(null);
        // Refresh the sector summary
        dispatch(fetchSectorSummary() as any);
        if (onSectorUpdated) {
          onSectorUpdated();
        }
      } else {
        setSectorError(result.payload?.message || 'Failed to edit sector');
      }
    } catch (err) {
      console.error('Failed to edit sector:', err);
      setSectorError('Failed to edit sector');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedSector) return;
    
    setSectorError(null);
    try {
      const result = await dispatch(deleteSector(selectedSector.title) as any);
      
      if (deleteSector.fulfilled.match(result)) {
        setIsDeleteModalOpen(false);
        setSelectedSector(null);
        // Refresh the sector summary
        dispatch(fetchSectorSummary() as any);
        if (onSectorUpdated) {
          onSectorUpdated();
        }
      } else {
        setSectorError(result.payload?.message || 'Failed to delete sector');
        setIsDeleteModalOpen(false);
      }
    } catch (err) {
      console.error('Failed to delete sector:', err);
      setSectorError('Failed to delete sector');
      setIsDeleteModalOpen(false);
    }
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 
          className="text-gray-800"
          style={{
            fontFamily: 'Baskervville',
            fontWeight: 500,
            fontStyle: 'normal',
            fontSize: '30px'
          }}
        >
          List of Questions
        </h1>
        {onAddSector && (
          <Button
            variant="gradient"
            onClick={() => setIsAddModalOpen(true)}
            disabled={isLoading}
          >
            + Add Sector
          </Button>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading sectors...</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          {onRetry && (
            <Button
              variant="outline"
              onClick={onRetry}
            >
              Retry
            </Button>
          )}
        </div>
      )}

      {/* Question Categories Grid */}
      {!isLoading && !error && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="hover:shadow-md transition-shadow duration-200 relative">
            <CardHeader className="relative">
              {/* Three-dot menu */}
              <div className="absolute top-2 right-2 menu-container">
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === category.id ? null : category.id);
                    }}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="More options"
                  >
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                  {/* Dropdown menu */}
                  {openMenuId === category.id && (
                    <div
                      className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg z-10 border border-gray-200"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => {
                          handleEditSector(category);
                          setOpenMenuId(null);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          handleDeleteClick(category);
                          setOpenMenuId(null);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <h3 
                className="text-gray-800 pr-8"
                style={{
                  fontFamily: 'Golos Text',
                  fontWeight: 500,
                  fontStyle: 'normal',
                  fontSize: '18px'
                }}
              >
                {category.title}
              </h3>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <p 
                  className="text-gray-800"
                  style={{
                    fontFamily: 'Golos Text',
                    fontWeight: 600,
                    fontStyle: 'normal',
                    fontSize: '14px'
                  }}
                >
                  Total Questions: {category.totalQuestions}
                </p>
                <p 
                  className="text-gray-600"
                  style={{
                    fontFamily: 'Golos Text',
                    fontWeight: 400,
                    fontStyle: 'normal',
                    fontSize: '14px'
                  }}
                >
                  Impact Questions: {category.impactQuestions}
                </p>
                <p 
                  className="text-gray-600"
                  style={{
                    fontFamily: 'Golos Text',
                    fontWeight: 400,
                    fontStyle: 'normal',
                    fontSize: '14px'
                  }}
                >
                  Risk Questions: {category.riskQuestions}
                </p>
                <p 
                  className="text-gray-600"
                  style={{
                    fontFamily: 'Golos Text',
                    fontWeight: 400,
                    fontStyle: 'normal',
                    fontSize: '14px'
                  }}
                >
                  Return Questions: {category.returnQuestions}
                </p>
              </div>
            </CardContent>

            <CardFooter>
              <Button 
                variant="gradient" 
                className="w-full"
                onClick={() => onCategorySelect(category.id)}
              >
                Next
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      )}

      {/* No categories available */}
      {!isLoading && !error && categories.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">No sectors available</p>
        </div>
      )}

      {/* Add Sector Modal */}
      {onAddSector && (
        <AddSectorModal
          isOpen={isAddModalOpen}
          onClose={handleCloseModal}
          onAddSector={handleAddSector}
          isAdding={isAdding}
          error={addSectorError}
        />
      )}

      {/* Edit Sector Modal */}
      <AddSectorModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onEditSector={handleEditSectorSubmit}
        isAdding={isAdding}
        error={sectorError}
        editMode={true}
        initialSectorName={selectedSector?.title || ''}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Sector"
        message={`Are you sure you want to delete "${selectedSector?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setSelectedSector(null);
        }}
      />

      {/* Error message for delete/edit */}
      {sectorError && !isEditModalOpen && !isDeleteModalOpen && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{sectorError}</p>
        </div>
      )}
    </div>
  );
};

export default SectorCategories;
