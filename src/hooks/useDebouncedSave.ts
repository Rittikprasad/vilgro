import { useCallback, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../app/store';
import { saveAnswers } from '../features/assessment/assessmentSlice';

interface SaveAnswersParams {
  assessmentId: string;
  answers: Array<{ question: string; data: any }>;
}

export const useDebouncedSave = (delay: number = 500) => {
  const dispatch = useDispatch<AppDispatch>();
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const pendingSaveRef = useRef<SaveAnswersParams | null>(null);

  const debouncedSave = useCallback((assessmentId: string, answers: Array<{ question: string; data: any }>) => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Store the latest save request
    pendingSaveRef.current = { assessmentId, answers };

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      if (pendingSaveRef.current) {
        dispatch(saveAnswers(pendingSaveRef.current));
        pendingSaveRef.current = null;
      }
    }, delay);
  }, [dispatch, delay]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Immediate save function for when user navigates away
  const immediateSave = useCallback((assessmentId: string, answers: Array<{ question: string; data: any }>) => {
    // Clear any pending saves
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Save immediately
    dispatch(saveAnswers({ assessmentId, answers }));
  }, [dispatch]);

  return { debouncedSave, immediateSave };
};
