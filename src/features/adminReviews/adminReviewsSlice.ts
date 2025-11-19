import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";
import { endpoints } from "../../services/endpoints";
import type { AdminReviewsState, AdminReviewEntry, AdminReviewsPaginatedResponse } from "./adminReviewsTypes";

const initialState: AdminReviewsState = {
  items: [],
  isLoading: false,
  error: null,
  lastFetchedAt: null,
};

export const fetchAdminReviews = createAsyncThunk<
  AdminReviewEntry[],
  void,
  { rejectValue: string }
>("adminReviews/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<AdminReviewsPaginatedResponse | AdminReviewEntry[]>(
      endpoints.admin.reviews
    );
    const data = response.data;
    
    // Handle paginated response
    if (data && typeof data === "object" && "results" in data) {
      return (data as AdminReviewsPaginatedResponse).results;
    }
    
    // Handle array response
    if (Array.isArray(data)) {
      return data;
    }
    
    // Handle single object
    if (data && typeof data === "object") {
      return [data as AdminReviewEntry];
    }
    
    return [];
  } catch (error: any) {
    const message =
      error?.response?.data?.message ??
      error?.message ??
      "Failed to fetch reviews";
    return rejectWithValue(message);
  }
});

const adminReviewsSlice = createSlice({
  name: "adminReviews",
  initialState,
  reducers: {
    clearAdminReviewsError: (state) => {
      state.error = null;
    },
    resetAdminReviews: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminReviews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.lastFetchedAt = new Date().toISOString();
      })
      .addCase(fetchAdminReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to fetch reviews";
      });
  },
});

export const { clearAdminReviewsError, resetAdminReviews } =
  adminReviewsSlice.actions;
export default adminReviewsSlice.reducer;

