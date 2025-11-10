import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";
import { endpoints } from "../../services/endpoints";
import type {
  AdminActivityLogResponse,
  AdminActivityLogState,
  FetchAdminActivityLogParams,
} from "./adminActivityLogTypes";

const initialState: AdminActivityLogState = {
  items: [],
  count: 0,
  currentPage: 1,
  pageSize: 20,
  isLoading: false,
  error: null,
  lastFetchedAt: null,
};

export const fetchAdminActivityLog = createAsyncThunk<
  AdminActivityLogResponse,
  FetchAdminActivityLogParams | undefined,
  { rejectValue: string }
>("adminActivityLog/fetchAll", async (params, { rejectWithValue }) => {
  try {
    const response = await api.get<AdminActivityLogResponse>(endpoints.admin.audit, {
      params: {
        page: params?.page,
        page_size: params?.pageSize,
        search: params?.search,
      },
    });
    return response.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ??
      error?.message ??
      "Failed to fetch activity log";
    return rejectWithValue(message);
  }
});

const adminActivityLogSlice = createSlice({
  name: "adminActivityLog",
  initialState,
  reducers: {
    resetAdminActivityLog: () => initialState,
    clearAdminActivityLogError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminActivityLog.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
        if (action.meta.arg?.page) {
          state.currentPage = action.meta.arg.page;
        }
        if (action.meta.arg?.pageSize) {
          state.pageSize = action.meta.arg.pageSize;
        }
      })
      .addCase(fetchAdminActivityLog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.results;
        state.count = action.payload.count;
        state.currentPage = action.payload.page;
        state.pageSize = action.payload.page_size;
        state.lastFetchedAt = new Date().toISOString();
      })
      .addCase(fetchAdminActivityLog.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to fetch activity log";
      });
  },
});

export const { resetAdminActivityLog, clearAdminActivityLogError } =
  adminActivityLogSlice.actions;

export default adminActivityLogSlice.reducer;

