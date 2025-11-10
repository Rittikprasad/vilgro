import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";
import { endpoints } from "../../services/endpoints";
import type { AdminReviewsState, AdminReviewEntry } from "./adminReviewsTypes";

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
    const response = await api.get<AdminReviewEntry[] | AdminReviewEntry>(
      endpoints.admin.reviews
    );
    const data = response.data;
    if (Array.isArray(data)) {
      return data;
    }
    if (data && typeof data === "object") {
      return [data];
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

