import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import api from "../../services/api";
import { endpoints } from "../../services/endpoints";
import type { AdminSpoEntry, AdminSpoState, AssessmentResponsesData, AssessmentCooldownResponse } from "./adminSpoTypes";

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
  isDeleting: false,
  deleteError: null,
  assessmentResponses: null,
  isAssessmentResponsesLoading: false,
  assessmentResponsesError: null,
  assessmentCooldown: null,
  isCooldownLoading: false,
  isCooldownUpdating: false,
  cooldownError: null,
};

export interface AdminSpoFilters {
  q?: string; // Search: email / name / organization
  status?: 'active' | 'inactive'; // Filter by status
  ordering?: string; // Sort by: email, -email, first_name, -first_name, date_joined, -date_joined
  start_date?: string; // Date range start (YYYY-MM-DD)
  end_date?: string; // Date range end (YYYY-MM-DD)
}

export const fetchAdminSpos = createAsyncThunk<
  AdminSpoEntry[],
  AdminSpoFilters | void,
  { rejectValue: string }
>("adminSpo/fetchAll", async (filters, { rejectWithValue }) => {
  try {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.q) params.append('q', filters.q);
      if (filters.status) params.append('status', filters.status);
      if (filters.ordering) params.append('ordering', filters.ordering);
      if (filters.start_date) params.append('start_date', filters.start_date);
      if (filters.end_date) params.append('end_date', filters.end_date);
    }
    
    const queryString = params.toString();
    const url = queryString ? `${endpoints.admin.spos}?${queryString}` : endpoints.admin.spos;
    
    const response = await api.get<AdminSpoEntry[]>(url);
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
  url: string;
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

export const deleteAdminSpo = createAsyncThunk<
  void,
  number | string,
  { rejectValue: string }
>("adminSpo/delete", async (id, { rejectWithValue }) => {
  try {
    await api.delete(endpoints.admin.spoById(id));
  } catch (error: any) {
    const message =
      error?.response?.data?.message ??
      error?.message ??
      "Failed to delete SPO";
    return rejectWithValue(message);
  }
});

export interface FetchAssessmentResponsesParams {
  spoId: number | string;
  assessmentId: number | string;
}

export const fetchAssessmentResponses = createAsyncThunk<
  AssessmentResponsesData,
  FetchAssessmentResponsesParams,
  { rejectValue: string }
>("adminSpo/fetchAssessmentResponses", async ({ spoId, assessmentId }, { rejectWithValue }) => {
  try {
    const response = await api.get<AssessmentResponsesData>(
      endpoints.admin.spoAssessmentResponses(spoId, assessmentId)
    );
    return response.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ??
      error?.response?.data?.detail ??
      error?.message ??
      "Failed to fetch assessment responses";
    return rejectWithValue(message);
  }
});

export const fetchAssessmentCooldown = createAsyncThunk<
  AssessmentCooldownResponse,
  void,
  { rejectValue: string }
>("adminSpo/fetchAssessmentCooldown", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<AssessmentCooldownResponse>(
      endpoints.admin.assessmentCooldown
    );
    return response.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ??
      error?.response?.data?.detail ??
      error?.message ??
      "Failed to fetch assessment cooldown";
    return rejectWithValue(message);
  }
});

export const updateAssessmentCooldown = createAsyncThunk<
  AssessmentCooldownResponse,
  number,
  { rejectValue: string }
>("adminSpo/updateAssessmentCooldown", async (days, { rejectWithValue }) => {
  try {
    const response = await api.patch<AssessmentCooldownResponse>(
      endpoints.admin.assessmentCooldown,
      { days }
    );
    return response.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ??
      error?.response?.data?.detail ??
      error?.message ??
      "Failed to update assessment cooldown";
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
    clearAdminSpoDeleteError: (state) => {
      state.deleteError = null;
    },
    clearAssessmentResponsesError: (state) => {
      state.assessmentResponsesError = null;
    },
    resetAssessmentResponses: (state) => {
      state.assessmentResponses = null;
      state.assessmentResponsesError = null;
      state.isAssessmentResponsesLoading = false;
    },
    clearCooldownError: (state) => {
      state.cooldownError = null;
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
    builder
      .addCase(deleteAdminSpo.pending, (state) => {
        state.isDeleting = true;
        state.deleteError = null;
      })
      .addCase(deleteAdminSpo.fulfilled, (state, action) => {
        state.isDeleting = false;
        const id = Number(action.meta.arg);
        state.items = state.items.filter((item) => item.id !== id);
        if (state.selected && state.selected.id === id) {
          state.selected = null;
        }
      })
      .addCase(deleteAdminSpo.rejected, (state, action) => {
        state.isDeleting = false;
        state.deleteError = action.payload ?? "Failed to delete SPO";
      });
    builder
      .addCase(fetchAssessmentResponses.pending, (state) => {
        state.isAssessmentResponsesLoading = true;
        state.assessmentResponsesError = null;
      })
      .addCase(fetchAssessmentResponses.fulfilled, (state, action) => {
        state.isAssessmentResponsesLoading = false;
        state.assessmentResponses = action.payload;
      })
      .addCase(fetchAssessmentResponses.rejected, (state, action) => {
        state.isAssessmentResponsesLoading = false;
        state.assessmentResponsesError = action.payload ?? "Failed to fetch assessment responses";
      });
    builder
      .addCase(fetchAssessmentCooldown.pending, (state) => {
        state.isCooldownLoading = true;
        state.cooldownError = null;
      })
      .addCase(fetchAssessmentCooldown.fulfilled, (state, action) => {
        state.isCooldownLoading = false;
        state.assessmentCooldown = action.payload.days;
      })
      .addCase(fetchAssessmentCooldown.rejected, (state, action) => {
        state.isCooldownLoading = false;
        state.cooldownError = action.payload ?? "Failed to fetch assessment cooldown";
      });
    builder
      .addCase(updateAssessmentCooldown.pending, (state) => {
        state.isCooldownUpdating = true;
        state.cooldownError = null;
      })
      .addCase(updateAssessmentCooldown.fulfilled, (state, action) => {
        state.isCooldownUpdating = false;
        state.assessmentCooldown = action.payload.days;
      })
      .addCase(updateAssessmentCooldown.rejected, (state, action) => {
        state.isCooldownUpdating = false;
        state.cooldownError = action.payload ?? "Failed to update assessment cooldown";
      });
  },
});

export const {
  clearAdminSpoError,
  clearAdminSpoDetailError,
  clearAdminSpoReportError,
  clearAdminSpoDeleteError,
  clearAssessmentResponsesError,
  clearCooldownError,
  resetAssessmentResponses,
  resetAdminSpo,
  resetSelectedAdminSpo,
  setSelectedAdminSpo,
} = adminSpoSlice.actions;
export default adminSpoSlice.reducer;

