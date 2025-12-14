import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  fetchAssessmentCooldown,
  updateAssessmentCooldown,
  clearCooldownError,
} from "../../../features/adminSpo/adminSpoSlice";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/Select";
import { showNotification } from "../../../services/notificationService";

interface CooldownModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CooldownModal: React.FC<CooldownModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const {
    assessmentCooldown,
    isCooldownLoading,
    isCooldownUpdating,
    cooldownError,
  } = useAppSelector((state) => state.adminSpo);

  const [value, setValue] = useState<string>("");
  const [type, setType] = useState<"minutes" | "hours" | "days">("days");
  const [localError, setLocalError] = useState<string | null>(null);

  // Fetch current cooldown when modal opens
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchAssessmentCooldown());
      setLocalError(null);
    }
  }, [isOpen, dispatch]);

  // Update local state when cooldown is fetched
  useEffect(() => {
    if (assessmentCooldown !== null) {
      setValue(assessmentCooldown.value.toString());
      setType(assessmentCooldown.type || "days");
    }
  }, [assessmentCooldown]);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Allow empty string or valid numbers
    // When field is cleared, keep it as empty string (not "0")
    if (inputValue === "") {
      setValue("");
      setLocalError(null);
    } else if (!isNaN(Number(inputValue)) && Number(inputValue) >= 0) {
      setValue(inputValue);
      setLocalError(null);
    }
  };

  const handleTypeChange = (newType: string) => {
    setType(newType as "minutes" | "hours" | "days");
    setLocalError(null);
  };

  const handleSave = async () => {
    const numericValue = value === "" ? 0 : parseFloat(value);
    
    if (isNaN(numericValue) || numericValue < 0) {
      setLocalError("Value must be a positive number");
      return;
    }

    if (value === "") {
      setLocalError("Please enter a value");
      return;
    }

    try {
      const payload = { value: numericValue, type };
      await dispatch(updateAssessmentCooldown(payload)).unwrap();
      
      const typeLabel = type === "minutes" ? "minute" : type === "hours" ? "hour" : "day";
      showNotification({
        type: "success",
        title: "Success",
        message: `Assessment cooldown period updated to ${numericValue} ${typeLabel}${numericValue !== 1 ? 's' : ''}.`,
      });
      onClose();
    } catch (error) {
      // Error is handled by Redux state
      console.error("Failed to update cooldown:", error);
    }
  };

  const handleClose = () => {
    setLocalError(null);
    dispatch(clearCooldownError());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur effect */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 font-golos">
              Assessment Cooldown Settings
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="cooldown-type"
                className="block text-sm font-medium text-gray-700 mb-2 font-golos"
              >
                Cooldown Period Type
              </label>
              <p className="text-xs text-gray-500 mb-3 font-golos">
                Select the time unit for the cooldown period.
              </p>
              {isCooldownLoading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                </div>
              ) : (
                <Select
                  value={type}
                  onValueChange={handleTypeChange}
                  disabled={isCooldownUpdating}
                >
                  <SelectTrigger className="w-full h-12 rounded-lg bg-white">
                    <SelectValue placeholder="Select time unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minutes">Minutes</SelectItem>
                    <SelectItem value="hours">Hours</SelectItem>
                    <SelectItem value="days">Days</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>

            <div>
              <label
                htmlFor="cooldown-value"
                className="block text-sm font-medium text-gray-700 mb-2 font-golos"
              >
                Cooldown Period Value
              </label>
              <p className="text-xs text-gray-500 mb-3 font-golos">
                Set the number of {type} SPOs must wait before they can retake the assessment.
              </p>
              {isCooldownLoading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                </div>
              ) : (
                <Input
                  id="cooldown-value"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={value}
                  onChange={handleValueChange}
                  className="w-full"
                  disabled={isCooldownUpdating}
                  placeholder={`Enter number of ${type}`}
                />
              )}
            </div>

            {(localError || cooldownError) && (
              <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {localError || cooldownError}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isCooldownUpdating}
              >
                Cancel
              </Button>
              <Button
                variant="gradient"
                onClick={handleSave}
                disabled={isCooldownLoading || isCooldownUpdating}
              >
                {isCooldownUpdating ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CooldownModal;
