import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";
import { endpoints } from "../../services/endpoints";
import type {
  AdminBankEntry,
  AdminBankPayload,
  AdminBankState,
} from "./adminBankTypes";

const initialState: AdminBankState = {
  items: [],
  isLoading: false,
  error: null,
  isCreating: false,
  createError: null,
  isUpdating: false,
  updateError: null,
  lastFetchedAt: null,
};

export const fetchAdminBanks = createAsyncThunk<
  AdminBankEntry[],
  void,
  { rejectValue: string }
>("adminBank/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<AdminBankEntry[]>(endpoints.admin.banks);
    return response.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ??
      error?.message ??
      "Failed to fetch banks";
    return rejectWithValue(message);
  }
});

export const createAdminBank = createAsyncThunk<
  AdminBankEntry,
  AdminBankPayload,
  { rejectValue: string }
>("adminBank/create", async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post<AdminBankEntry>(endpoints.admin.banks, payload);
    return response.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ??
      error?.message ??
      "Failed to create bank";
    return rejectWithValue(message);
  }
});

export const updateAdminBank = createAsyncThunk<
  AdminBankEntry,
  { id: number; data: AdminBankPayload },
  { rejectValue: string }
>("adminBank/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await api.patch<AdminBankEntry>(endpoints.admin.bankById(id), data);
    return response.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ??
      error?.message ??
      "Failed to update bank";
    return rejectWithValue(message);
  }
});

const adminBankSlice = createSlice({
  name: "adminBank",
  initialState,
  reducers: {
    clearAdminBankError: (state) => {
      state.error = null;
      state.createError = null;
      state.updateError = null;
    },
    resetAdminBank: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminBanks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminBanks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.lastFetchedAt = new Date().toISOString();
      })
      .addCase(fetchAdminBanks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to fetch banks";
      })
      .addCase(createAdminBank.pending, (state) => {
        state.isCreating = true;
        state.createError = null;
      })
      .addCase(createAdminBank.fulfilled, (state, action) => {
        state.isCreating = false;
        state.items = [action.payload, ...state.items];
      })
      .addCase(createAdminBank.rejected, (state, action) => {
        state.isCreating = false;
        state.createError = action.payload ?? "Failed to create bank";
      })
      .addCase(updateAdminBank.pending, (state) => {
        state.isUpdating = true;
        state.updateError = null;
      })
      .addCase(updateAdminBank.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.items = state.items.map((bank) =>
          bank.id === action.payload.id ? action.payload : bank
        );
      })
      .addCase(updateAdminBank.rejected, (state, action) => {
        state.isUpdating = false;
        state.updateError = action.payload ?? "Failed to update bank";
      });
  },
});

export const { clearAdminBankError, resetAdminBank } = adminBankSlice.actions;
export default adminBankSlice.reducer;

