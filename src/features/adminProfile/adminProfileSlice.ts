import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";
import { endpoints } from "../../services/endpoints";
import type {
  AdminProfileResponse,
  AdminProfileState,
} from "./adminProfileTypes";

const initialState: AdminProfileState = {
  user: null,
  organization: null,
  isLoading: false,
  error: null,
  lastFetchedAt: null,
};

export const fetchAdminProfile = createAsyncThunk<
  AdminProfileResponse,
  void,
  { rejectValue: string }
>("adminProfile/fetch", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<AdminProfileResponse>(endpoints.auth.profile);
    return response.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ??
      error?.message ??
      "Failed to load profile";
    return rejectWithValue(message);
  }
});

const adminProfileSlice = createSlice({
  name: "adminProfile",
  initialState,
  reducers: {
    clearAdminProfileError: (state) => {
      state.error = null;
    },
    resetAdminProfile: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.organization = action.payload.organization;
        state.lastFetchedAt = new Date().toISOString();
      })
      .addCase(fetchAdminProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to load profile";
      });
  },
});

export const { clearAdminProfileError, resetAdminProfile } =
  adminProfileSlice.actions;

export default adminProfileSlice.reducer;

