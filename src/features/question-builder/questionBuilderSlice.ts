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
  QuestionCode,
} from "./types";

// Initial state
const getInitialState = (): IInitialQuestionBuilderState => {
  return {
    sections: [],
    questions: [],
    questionCodes: [],
    isLoading: false,
    questionsLoading: false,
    questionCodesLoading: false,
    error: null,
    questionsError: null,
    questionCodesError: null,
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

// Async thunk to delete a question
export const deleteAdminQuestion = createAsyncThunk<
  number | string,
  number | string,
  { rejectValue: { message: string; status: number } }
>(
  "questionBuilder/deleteAdminQuestion",
  async (id, { rejectWithValue }) => {
    try {
      await adminApi.deleteQuestion(id);
      ApiResponseHandler.handleSuccess({ message: "Question deleted successfully!" });
      return id;
    } catch (error: any) {
      ApiResponseHandler.handleError(error, "Failed to delete question");
      const errorMessage = error.response?.data?.message || "Failed to delete question";
      return rejectWithValue({
        message: errorMessage,
        status: error.response?.status || 500,
      });
    }
  }
);

// Async thunk to fetch question codes by section
export const fetchQuestionCodesBySection = createAsyncThunk<
  QuestionCode[],
  string,
  { rejectValue: { message: string; status: number } }
>(
  "questionBuilder/fetchQuestionCodesBySection",
  async (sectionCode, { rejectWithValue }) => {
    try {
      const response = await api.get<QuestionCode[]>(
        endpoints.admin.questionCodes(sectionCode)
      );
      return response.data;
    } catch (error: any) {
      ApiResponseHandler.handleError(error, "Failed to fetch question codes");
      const errorMessage = error.response?.data?.message || "Failed to fetch question codes";
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
      })
      // Delete question reducers
      .addCase(deleteAdminQuestion.pending, (state) => {
        state.questionsLoading = true;
        state.questionsError = null;
      })
      .addCase(deleteAdminQuestion.fulfilled, (state, action) => {
        state.questionsLoading = false;
        // Remove the deleted question from the state
        state.questions = state.questions.filter(q => q.id !== action.payload);
        state.questionsError = null;
      })
      .addCase(deleteAdminQuestion.rejected, (state, action) => {
        state.questionsLoading = false;
        state.questionsError = action.payload?.message || "Failed to delete question";
      })
      // Question codes reducers
      .addCase(fetchQuestionCodesBySection.pending, (state) => {
        state.questionCodesLoading = true;
        state.questionCodesError = null;
      })
      .addCase(fetchQuestionCodesBySection.fulfilled, (state, action) => {
        state.questionCodesLoading = false;
        state.questionCodes = action.payload;
        state.questionCodesError = null;
      })
      .addCase(fetchQuestionCodesBySection.rejected, (state, action) => {
        state.questionCodesLoading = false;
        state.questionCodesError = action.payload?.message || "Failed to fetch question codes";
      });
  },
});

export const {
  clearError,
  clearQuestionsError,
  clearQuestions,
  clearState,
} = questionBuilderSlice.actions;

export const clearQuestionCodes = questionBuilderSlice.actions;

export default questionBuilderSlice.reducer;

export const questionBuilderActionCreator = {
  fetchAdminSections,
  fetchQuestionsBySection,
  fetchQuestionCodesBySection,
  updateAdminQuestion,
  deleteAdminQuestion,
};
