import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";
import { endpoints } from "../../services/endpoints";
import type {
  AdminDashboardState,
  DashboardSummaryResponse,
} from "./adminDashboardTypes";

const initialState: AdminDashboardState = {
  summary: null,
  isLoading: false,
  error: null,
  lastFetchedAt: null,
};

export interface DashboardFilters {
  start_date?: string;
  end_date?: string;
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

export const fetchAdminDashboardSummary = createAsyncThunk<
  DashboardSummaryResponse,
  DashboardFilters | void,
  { rejectValue: string }
>("adminDashboard/fetchSummary", async (filters, { rejectWithValue }) => {
  try {
    const params = new URLSearchParams();
    if (filters?.start_date) {
      const fromDate = formatDateToISO(filters.start_date, false);
      if (fromDate) {
        params.append('from', fromDate);
      }
    }
    if (filters?.end_date) {
      const toDate = formatDateToISO(filters.end_date, true);
      if (toDate) {
        params.append('to', toDate);
      }
    }
    
    const queryString = params.toString();
    const url = queryString 
      ? `${endpoints.admin.dashboardSummary}?${queryString}`
      : endpoints.admin.dashboardSummary;
    
    const response = await api.get<DashboardSummaryResponse>(url);
    return response.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ??
      error?.message ??
      "Failed to fetch admin dashboard summary";
    return rejectWithValue(message);
  }
});

const adminDashboardSlice = createSlice({
  name: "adminDashboard",
  initialState,
  reducers: {
    clearAdminDashboardError: (state) => {
      state.error = null;
    },
    resetAdminDashboard: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminDashboardSummary.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminDashboardSummary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.summary = action.payload;
        state.error = null;
        state.lastFetchedAt = new Date().toISOString();
      })
      .addCase(fetchAdminDashboardSummary.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to fetch admin dashboard summary";
      });
  },
});

export const { clearAdminDashboardError, resetAdminDashboard } =
  adminDashboardSlice.actions;
export default adminDashboardSlice.reducer;

