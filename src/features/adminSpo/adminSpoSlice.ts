import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import api from "../../services/api";
import { endpoints } from "../../services/endpoints";
import type { AdminSpoEntry, AdminSpoState } from "./adminSpoTypes";

const initialState: AdminSpoState = {
  items: [],
  isLoading: false,
  error: null,
  lastFetchedAt: null,
  selected: null,
  isDetailLoading: false,
  detailError: null,
  isReportDownloading: false,
  reportError: null,
};

export const fetchAdminSpos = createAsyncThunk<
  AdminSpoEntry[],
  void,
  { rejectValue: string }
>("adminSpo/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<AdminSpoEntry[]>(endpoints.admin.spos);
    return response.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ??
      error?.message ??
      "Failed to fetch SPOs";
    return rejectWithValue(message);
  }
});

export const fetchAdminSpoById = createAsyncThunk<
  AdminSpoEntry,
  number | string,
  { rejectValue: string }
>("adminSpo/fetchById", async (id, { rejectWithValue }) => {
  try {
    const response = await api.get<AdminSpoEntry>(endpoints.admin.spoById(id));
    return response.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ??
      error?.message ??
      "Failed to fetch SPO details";
    return rejectWithValue(message);
  }
});

export interface AdminSpoReportPayload {
  blob: Blob;
  filename: string;
}

export const fetchAdminSpoReport = createAsyncThunk<
  AdminSpoReportPayload,
  number | string,
  { rejectValue: string }
>("adminSpo/fetchReport", async (id, { rejectWithValue }) => {
  try {
    const response = await api.get<Blob>(endpoints.admin.spoReport(id), {
      responseType: "blob",
    });

    const disposition = response.headers["content-disposition"] ?? "";
    const filenameMatch = disposition.match(/filename\*?=(?:UTF-8'')?["']?([^"';\n]+)["']?/i);
    const filename = filenameMatch ? decodeURIComponent(filenameMatch[1]) : `spo-report-${id}.pdf`;

    return {
      blob: response.data,
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

const adminSpoSlice = createSlice({
  name: "adminSpo",
  initialState,
  reducers: {
    clearAdminSpoError: (state) => {
      state.error = null;
    },
    clearAdminSpoDetailError: (state) => {
      state.detailError = null;
    },
    resetSelectedAdminSpo: (state) => {
      state.selected = null;
      state.detailError = null;
      state.isDetailLoading = false;
    },
    setSelectedAdminSpo: (state, action: PayloadAction<AdminSpoEntry | null>) => {
      state.selected = action.payload;
    },
    clearAdminSpoReportError: (state) => {
      state.reportError = null;
    },
    resetAdminSpo: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminSpos.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminSpos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.lastFetchedAt = new Date().toISOString();
      })
      .addCase(fetchAdminSpos.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to fetch SPOs";
      });
    builder
      .addCase(fetchAdminSpoById.pending, (state) => {
        state.isDetailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchAdminSpoById.fulfilled, (state, action) => {
        state.isDetailLoading = false;
        state.selected = action.payload;
        const existingIndex = state.items.findIndex((item) => item.id === action.payload.id);
        if (existingIndex >= 0) {
          state.items[existingIndex] = action.payload;
        } else {
          state.items.push(action.payload);
        }
      })
      .addCase(fetchAdminSpoById.rejected, (state, action) => {
        state.isDetailLoading = false;
        state.detailError = action.payload ?? "Failed to fetch SPO details";
      });
    builder
      .addCase(fetchAdminSpoReport.pending, (state) => {
        state.isReportDownloading = true;
        state.reportError = null;
      })
      .addCase(fetchAdminSpoReport.fulfilled, (state) => {
        state.isReportDownloading = false;
      })
      .addCase(fetchAdminSpoReport.rejected, (state, action) => {
        state.isReportDownloading = false;
        state.reportError = action.payload ?? "Failed to download SPO report";
      });
  },
});

export const {
  clearAdminSpoError,
  clearAdminSpoDetailError,
  clearAdminSpoReportError,
  resetAdminSpo,
  resetSelectedAdminSpo,
  setSelectedAdminSpo,
} = adminSpoSlice.actions;
export default adminSpoSlice.reducer;

