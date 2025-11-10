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

export const fetchAdminDashboardSummary = createAsyncThunk<
  DashboardSummaryResponse,
  void,
  { rejectValue: string }
>("adminDashboard/fetchSummary", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<DashboardSummaryResponse>(
      endpoints.admin.dashboardSummary
    );
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

