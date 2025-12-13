import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";
import { endpoints } from "../../services/endpoints";
import type {
  AdminDetailsPayload,
  AdminDetailsResponse,
  AdminDetailsState,
  FetchAdminDetailsParams,
} from "./adminDetailsTypes";

const initialState: AdminDetailsState = {
  items: [],
  count: 0,
  next: null,
  previous: null,
  isLoading: false,
  error: null,
  lastFetchedAt: null,
  currentPage: 1,
  pageSize: 10,
  searchTerm: "",
  ordering: null,
  isCreating: false,
  createError: null,
  isUpdating: false,
  updateError: null,
  isDeleting: false,
  deleteError: null,
};

export const fetchAdminDetails = createAsyncThunk<
  AdminDetailsResponse,
  FetchAdminDetailsParams | undefined,
  { rejectValue: string }
>("adminDetails/fetchAll", async (params, { rejectWithValue }) => {
  try {
    const response = await api.get<AdminDetailsResponse>(endpoints.admin.admins, {
      params: {
        page: params?.page,
        page_size: params?.pageSize,
        search: params?.search,
        ordering: params?.ordering,
      },
    });
    return response.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ??
      error?.message ??
      "Failed to fetch admins";
    return rejectWithValue(message);
  }
});

export const createAdminDetail = createAsyncThunk<
  AdminDetailsResponse["results"][number],
  AdminDetailsPayload,
  { rejectValue: string }
>("adminDetails/create", async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post<AdminDetailsResponse["results"][number]>(
      endpoints.admin.admins,
      payload
    );
    return response.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ??
      error?.message ??
      "Failed to create admin";
    return rejectWithValue(message);
  }
});

export const updateAdminDetail = createAsyncThunk<
  AdminDetailsResponse["results"][number],
  { id: number | string; data: Partial<AdminDetailsPayload> },
  { rejectValue: string }
>("adminDetails/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await api.patch<AdminDetailsResponse["results"][number]>(
      endpoints.admin.adminById(id),
      data
    );
    return response.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ??
      error?.message ??
      "Failed to update admin";
    return rejectWithValue(message);
  }
});

export const deleteAdminDetail = createAsyncThunk<
  number | string,
  number | string,
  { rejectValue: string }
>("adminDetails/delete", async (id, { rejectWithValue }) => {
  try {
    await api.delete(endpoints.admin.adminById(id));
    return id;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ??
      error?.message ??
      "Failed to delete admin";
    return rejectWithValue(message);
  }
});

const adminDetailsSlice = createSlice({
  name: "adminDetails",
  initialState,
  reducers: {
    resetAdminDetails: () => initialState,
    clearAdminDetailsError: (state) => {
      state.error = null;
      state.createError = null;
      state.updateError = null;
      state.deleteError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminDetails.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
        if (action.meta.arg?.page) {
          state.currentPage = action.meta.arg.page;
        }
        if (action.meta.arg?.pageSize) {
          state.pageSize = action.meta.arg.pageSize;
        }
        if (typeof action.meta.arg?.search === "string") {
          state.searchTerm = action.meta.arg.search;
        }
        if (typeof action.meta.arg?.ordering === "string") {
          state.ordering = action.meta.arg.ordering;
        }
      })
      .addCase(fetchAdminDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.results;
        state.count = action.payload.count;
        state.next = action.payload.next;
        state.previous = action.payload.previous;
        state.lastFetchedAt = new Date().toISOString();
      })
      .addCase(fetchAdminDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to fetch admins";
      });
    builder
      .addCase(createAdminDetail.pending, (state) => {
        state.isCreating = true;
        state.createError = null;
      })
      .addCase(createAdminDetail.fulfilled, (state, action) => {
        state.isCreating = false;
        state.items = [action.payload, ...state.items];
        state.count += 1;
      })
      .addCase(createAdminDetail.rejected, (state, action) => {
        state.isCreating = false;
        state.createError = action.payload ?? "Failed to create admin";
      });
    builder
      .addCase(updateAdminDetail.pending, (state) => {
        state.isUpdating = true;
        state.updateError = null;
      })
      .addCase(updateAdminDetail.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.items = state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
      })
      .addCase(updateAdminDetail.rejected, (state, action) => {
        state.isUpdating = false;
        state.updateError = action.payload ?? "Failed to update admin";
      });
    builder
      .addCase(deleteAdminDetail.pending, (state) => {
        state.isDeleting = true;
        state.deleteError = null;
      })
      .addCase(deleteAdminDetail.fulfilled, (state, action) => {
        state.isDeleting = false;
        const deletedId = Number(action.payload);
        state.items = state.items.filter((item) => item.id !== deletedId);
        state.count = Math.max(0, state.count - 1);
      })
      .addCase(deleteAdminDetail.rejected, (state, action) => {
        state.isDeleting = false;
        state.deleteError = action.payload ?? "Failed to delete admin";
      });
  },
});

export const { resetAdminDetails, clearAdminDetailsError } =
  adminDetailsSlice.actions;

export default adminDetailsSlice.reducer;

