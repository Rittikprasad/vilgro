import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import api from "../../services/api";
import { endpoints } from "../../services/endpoints";
import type { BankingSpoEntry, BankingSpoState, BankingSpoPaginatedResponse, BankingSpoReportPayload } from "./bankingSpoTypes";

const initialState: BankingSpoState = {
  items: [],
  count: 0,
  isLoading: false,
  error: null,
  lastFetchedAt: null,
  selected: null,
  isDetailLoading: false,
  detailError: null,
  isReportDownloading: false,
  reportError: null,
};

export interface BankingSpoFilters {
  q?: string; // Search: email / name / organization
  status?: 'active' | 'inactive'; // Filter by status
  ordering?: string; // Sort by: email, -email, first_name, -first_name, date_joined, -date_joined
  start_date?: string; // Date range start (YYYY-MM-DD)
  end_date?: string; // Date range end (YYYY-MM-DD)
}

// Helper function to convert date string (YYYY-MM-DD) to ISO datetime UTC
const formatDateToISO = (dateString: string, isEndDate: boolean = false): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  // Set to UTC and format as ISO datetime
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  
  if (isEndDate) {
    // End date: set to end of day (23:59:59)
    return `${year}-${month}-${day}T23:59:59`;
  } else {
    // Start date: set to start of day (00:00:00)
    return `${year}-${month}-${day}T00:00:00`;
  }
};

export const fetchBankSpos = createAsyncThunk<
  BankingSpoPaginatedResponse,
  BankingSpoFilters | void,
  { rejectValue: string }
>("bankingSpo/fetchAll", async (filters, { rejectWithValue }) => {
  try {
    const params = new URLSearchParams();
    
    if (filters) {
      // Only add search if it has a value (don't send empty string)
      if (filters.q && filters.q.trim()) {
        params.append('q', filters.q.trim());
      }
      if (filters.status) params.append('status', filters.status);
      if (filters.ordering) params.append('ordering', filters.ordering);
      // Format dates as ISO datetime UTC
      if (filters.start_date) {
        const fromDate = formatDateToISO(filters.start_date, false);
        if (fromDate) {
          params.append('from', fromDate);
        }
      }
      if (filters.end_date) {
        const toDate = formatDateToISO(filters.end_date, true);
        if (toDate) {
          params.append('to', toDate);
        }
      }
    }
    
    const queryString = params.toString();
    const url = queryString ? `${endpoints.bank.spos}?${queryString}` : endpoints.bank.spos;
    
    const response = await api.get<BankingSpoPaginatedResponse>(url);
    return response.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ??
      error?.response?.data?.errors ??
      error?.message ??
      "Failed to fetch SPOs";
    return rejectWithValue(message);
  }
});

export const fetchBankSpoById = createAsyncThunk<
  BankingSpoEntry,
  number | string,
  { rejectValue: string }
>("bankingSpo/fetchById", async (id, { rejectWithValue }) => {
  try {
    const response = await api.get<BankingSpoEntry>(endpoints.bank.spoById(id));
    return response.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ??
      error?.message ??
      "Failed to fetch SPO details";
    return rejectWithValue(message);
  }
});

export const fetchBankSpoReport = createAsyncThunk<
  BankingSpoReportPayload,
  number | string,
  { rejectValue: string }
>("bankingSpo/fetchReport", async (id, { rejectWithValue }) => {
  try {
    const response = await api.get<Blob>(endpoints.bank.spoReport(id), {
      responseType: "blob",
    });

    const disposition = response.headers["content-disposition"] ?? "";
    const filenameMatch = disposition.match(/filename\*?=(?:UTF-8'')?["']?([^"';\n]+)["']?/i);
    const filename = filenameMatch ? decodeURIComponent(filenameMatch[1]) : `banking-spo-report-${id}.pdf`;

    const blobUrl = window.URL.createObjectURL(response.data);

    return {
      url: blobUrl,
      filename,
    };
  } catch (error: any) {
    const message =
      error?.response?.data?.message ??
      error?.message ??
      "Failed to download SPO report";
    return rejectWithValue(message);
  }
});

const bankingSpoSlice = createSlice({
  name: "bankingSpo",
  initialState,
  reducers: {
    clearBankingSpoError: (state) => {
      state.error = null;
    },
    clearBankingSpoDetailError: (state) => {
      state.detailError = null;
    },
    resetSelectedBankingSpo: (state) => {
      state.selected = null;
      state.detailError = null;
      state.isDetailLoading = false;
    },
    setSelectedBankingSpo: (state, action: PayloadAction<BankingSpoEntry | null>) => {
      state.selected = action.payload;
    },
    clearBankingSpoReportError: (state) => {
      state.reportError = null;
    },
    resetBankingSpo: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBankSpos.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBankSpos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.results || [];
        state.count = action.payload.count || 0;
        state.lastFetchedAt = new Date().toISOString();
      })
      .addCase(fetchBankSpos.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to fetch SPOs";
      });
    builder
      .addCase(fetchBankSpoById.pending, (state) => {
        state.isDetailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchBankSpoById.fulfilled, (state, action) => {
        state.isDetailLoading = false;
        state.selected = action.payload;
        const existingIndex = state.items.findIndex((item) => item.id === action.payload.id);
        if (existingIndex >= 0) {
          state.items[existingIndex] = action.payload;
        } else {
          state.items.push(action.payload);
        }
      })
      .addCase(fetchBankSpoById.rejected, (state, action) => {
        state.isDetailLoading = false;
        state.detailError = action.payload ?? "Failed to fetch SPO details";
      });
    builder
      .addCase(fetchBankSpoReport.pending, (state) => {
        state.isReportDownloading = true;
        state.reportError = null;
      })
      .addCase(fetchBankSpoReport.fulfilled, (state) => {
        state.isReportDownloading = false;
      })
      .addCase(fetchBankSpoReport.rejected, (state, action) => {
        state.isReportDownloading = false;
        state.reportError = action.payload ?? "Failed to download SPO report";
      });
  },
});

export const {
  clearBankingSpoError,
  clearBankingSpoDetailError,
  clearBankingSpoReportError,
  resetBankingSpo,
  resetSelectedBankingSpo,
  setSelectedBankingSpo,
} = bankingSpoSlice.actions;
export default bankingSpoSlice.reducer;

