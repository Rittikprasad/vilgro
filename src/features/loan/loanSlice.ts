import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "../../services/api";
import { endpoints } from "../../services/endpoints";
import { ApiResponseHandler } from "../../lib/apiResponseHandler";
import type {
  LoanState,
  LoanMetaResponse,
  LoanPrefillResponse,
  LoanSubmitRequest,
  LoanSubmitResponse,
} from "./loanTypes";

/**
 * Initial loan state
 */
const initialState: LoanState = {
  fundTypes: [],
  prefillData: null,
  isLoading: false,
  isSubmitting: false,
  error: null,
  submitError: null,
};

/**
 * Async thunk to fetch loan meta (fund types)
 */
export const fetchLoanMeta = createAsyncThunk<
  LoanMetaResponse,
  void,
  { rejectValue: string }
>("loan/fetchMeta", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<LoanMetaResponse>(endpoints.loan.meta);
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Failed to fetch loan meta";
    return rejectWithValue(errorMessage);
  }
});

/**
 * Async thunk to fetch loan prefill data
 */
export const fetchLoanPrefill = createAsyncThunk<
  LoanPrefillResponse,
  number,
  { rejectValue: string }
>("loan/fetchPrefill", async (assessmentId, { rejectWithValue }) => {
  try {
    const response = await api.get<LoanPrefillResponse>(
      endpoints.loan.prefill(assessmentId)
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Failed to fetch loan prefill data";
    return rejectWithValue(errorMessage);
  }
});

/**
 * Async thunk to submit loan request
 */
export const submitLoanRequest = createAsyncThunk<
  LoanSubmitResponse,
  LoanSubmitRequest,
  { rejectValue: string }
>("loan/submit", async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post<LoanSubmitResponse>(
      endpoints.loan.submit,
      payload
    );
    
    // Show success notification
    ApiResponseHandler.handleSuccess({
      message: response.data.message || "Loan request submitted successfully!",
    });
    
    return response.data;
  } catch (error: any) {
    // Handle error with centralized error handler
    ApiResponseHandler.handleError(error, "Failed to submit loan request");
    
    const errorMessage =
      error.response?.data?.message || "Failed to submit loan request";
    return rejectWithValue(errorMessage);
  }
});

/**
 * Loan slice using Redux Toolkit
 * Manages loan state and provides reducers for state updates
 */
export const loanSlice = createSlice({
  name: "loan",
  initialState,
  reducers: {
    /**
     * Clear error message
     */
    clearError: (state) => {
      state.error = null;
      state.submitError = null;
    },

    /**
     * Reset loan state
     */
    resetLoan: (state) => {
      state.prefillData = null;
      state.error = null;
      state.submitError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch loan meta
      .addCase(fetchLoanMeta.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLoanMeta.fulfilled, (state, action) => {
        state.isLoading = false;
        state.fundTypes = action.payload.fund_types;
        state.error = null;
      })
      .addCase(fetchLoanMeta.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch loan meta";
      })

      // Fetch loan prefill
      .addCase(fetchLoanPrefill.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLoanPrefill.fulfilled, (state, action) => {
        state.isLoading = false;
        state.prefillData = action.payload;
        state.error = null;
      })
      .addCase(fetchLoanPrefill.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch loan prefill data";
      })

      // Submit loan request
      .addCase(submitLoanRequest.pending, (state) => {
        state.isSubmitting = true;
        state.submitError = null;
      })
      .addCase(submitLoanRequest.fulfilled, (state) => {
        state.isSubmitting = false;
        state.submitError = null;
      })
      .addCase(submitLoanRequest.rejected, (state, action) => {
        state.isSubmitting = false;
        state.submitError = action.payload || "Failed to submit loan request";
      });
  },
});

// Export actions
export const { clearError, resetLoan } = loanSlice.actions;

// Export reducer
export default loanSlice.reducer;

