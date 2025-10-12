import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "../../services/api";
import type { MetaState, MetaApiResponse } from "./metaTypes";

/**
 * Initial meta state
 * Defines the default state when the app starts
 */
const initialState: MetaState = {
  options: null,
  isLoading: false,
  error: null,
};

/**
 * Async thunk to fetch meta options
 * Handles API call to get all dropdown options for signup forms
 */
export const fetchMetaOptions = createAsyncThunk(
  "meta/fetchOptions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<MetaApiResponse>("/meta/options");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch meta options"
      );
    }
  }
);

/**
 * Meta slice using Redux Toolkit
 * Manages meta options state and provides reducers for state updates
 */
export const metaSlice = createSlice({
  name: "meta",
  initialState,
  reducers: {
    /**
     * Clears error message
     * Removes any existing error from state
     */
    clearError: (state) => {
      state.error = null;
    },

    /**
     * Resets meta state
     * Clears all meta data and resets to initial state
     */
    resetMeta: (state) => {
      state.options = null;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch meta options
      .addCase(fetchMetaOptions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchMetaOptions.fulfilled,
        (state, action: PayloadAction<MetaApiResponse>) => {
          state.isLoading = false;
          state.options = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchMetaOptions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Export action creators
export const { clearError, resetMeta } = metaSlice.actions;

// Export reducer
export default metaSlice.reducer;
