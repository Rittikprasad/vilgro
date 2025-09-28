import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

/**
 * Typed Redux hooks
 * Provides type-safe versions of useDispatch and useSelector hooks
 */

// Typed useDispatch hook
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Typed useSelector hook
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
