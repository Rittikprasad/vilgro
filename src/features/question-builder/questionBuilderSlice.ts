import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { endpoints } from "../../services/endpoints";
import api from "../../services/api";
import { adminApi, type CreateQuestionPayload } from "../../services/adminApi";
import { ApiResponseHandler } from "../../lib/apiResponseHandler";
import type {
  AdminSection,
  IInitialQuestionBuilderState,
  AdminQuestion,
} from "./types";

// Initial state
const getInitialState = (): IInitialQuestionBuilderState => {
  return {
    sections: [],
    questions: [],
    isLoading: false,
    questionsLoading: false,
    error: null,
    questionsError: null,
  };
};

// Async thunk to fetch admin sections
export const fetchAdminSections = createAsyncThunk<
  AdminSection[],
  void,
  { rejectValue: { message: string; status: number } }
>(
  "questionBuilder/fetchAdminSections",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<AdminSection[]>(
        endpoints.admin.sections
      );

      console.log("Admin sections API response:", response.data);

      return response.data;
    } catch (error: any) {
      // Handle error with centralized error handler
      ApiResponseHandler.handleError(error, "Failed to fetch sections");
      
      const errorMessage = error.response?.data?.message || "Failed to fetch sections";
      return rejectWithValue({
        message: errorMessage,
        status: error.response?.status || 500,
      });
    }
  }
);

// Async thunk to fetch questions by section
export const fetchQuestionsBySection = createAsyncThunk<
  AdminQuestion[],
  string,
  { rejectValue: { message: string; status: number } }
>(
  "questionBuilder/fetchQuestionsBySection",
  async (sectionCode, { rejectWithValue }) => {
    try {
      const response = await api.get<AdminQuestion[]>(
        endpoints.admin.questionsBySection(sectionCode)
      );

      console.log("Questions API response:", response.data);

      return response.data;
    } catch (error: any) {
      // Handle error with centralized error handler
      ApiResponseHandler.handleError(error, "Failed to fetch questions");
      
      const errorMessage = error.response?.data?.message || "Failed to fetch questions";
      return rejectWithValue({
        message: errorMessage,
        status: error.response?.status || 500,
      });
    }
  }
);

// Async thunk to update a question (partial/full)
export const updateAdminQuestion = createAsyncThunk<
  AdminQuestion,
  { id: number | string; data: Partial<CreateQuestionPayload> },
  { rejectValue: { message: string; status: number } }
>(
  "questionBuilder/updateAdminQuestion",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const updated = await adminApi.updateQuestion(id, data);
      // The API type may differ; cast to AdminQuestion for store usage
      return updated as unknown as AdminQuestion;
    } catch (error: any) {
      ApiResponseHandler.handleError(error, "Failed to update question");
      const errorMessage = error.response?.data?.message || "Failed to update question";
      return rejectWithValue({
        message: errorMessage,
        status: error.response?.status || 500,
      });
    }
  }
);

export const questionBuilderSlice = createSlice({
  name: "questionBuilder",
  initialState: getInitialState(),
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearQuestionsError(state) {
      state.questionsError = null;
    },
    clearQuestions(state) {
      state.questions = [];
    },
    clearState() {
      return getInitialState();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminSections.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminSections.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sections = action.payload;
        state.error = null;
      })
      .addCase(fetchAdminSections.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to fetch sections";
      })
      .addCase(fetchQuestionsBySection.pending, (state) => {
        state.questionsLoading = true;
        state.questionsError = null;
      })
      .addCase(fetchQuestionsBySection.fulfilled, (state, action) => {
        state.questionsLoading = false;
        state.questions = action.payload;
        state.questionsError = null;
      })
      .addCase(fetchQuestionsBySection.rejected, (state, action) => {
        state.questionsLoading = false;
        state.questionsError = action.payload?.message || "Failed to fetch questions";
      })
      // Update question reducers
      .addCase(updateAdminQuestion.pending, (state) => {
        state.questionsLoading = true;
        state.questionsError = null;
      })
      .addCase(updateAdminQuestion.fulfilled, (state, action) => {
        state.questionsLoading = false;
        const updated = action.payload;
        state.questions = state.questions.map((q) =>
          q.id === updated.id ? { ...q, ...updated } : q
        );
      })
      .addCase(updateAdminQuestion.rejected, (state, action) => {
        state.questionsLoading = false;
        state.questionsError = action.payload?.message || "Failed to update question";
      });
  },
});

export const {
  clearError,
  clearQuestionsError,
  clearQuestions,
  clearState,
} = questionBuilderSlice.actions;

export default questionBuilderSlice.reducer;

export const questionBuilderActionCreator = {
  fetchAdminSections,
  fetchQuestionsBySection,
  updateAdminQuestion,
};
