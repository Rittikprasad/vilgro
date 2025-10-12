import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { assessmentApi, type AssessmentStartResponse, type SectionsResponse, type QuestionsResponse, type SaveAnswersResponse, type SubmitResponse, type AssessmentResult, type MissingAnswersError } from '../../services/assessmentApi';

// State interface
interface AssessmentState {
  // Current assessment
  currentAssessment: AssessmentStartResponse | null;
  
  // Sections and progress
  sections: SectionsResponse | null;
  currentSection: string | null;
  
  // Questions
  questions: AssessmentQuestion[] | null;
  questionsLoading: boolean;
  
  // Answers (local state for form management)
  localAnswers: Record<string, any>;
  
  // Submission
  isSubmitting: boolean;
  submitError: string | null;
  
  // Results
  results: AssessmentResult | null;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
}

interface AssessmentQuestion {
  code: string;
  text: string;
  type: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'SLIDER' | 'RATING' | 'MULTI_SLIDER';
  required: boolean;
  options?: Array<{ label: string; value: string; points: string }>;
  dimensions?: Array<{ code: string; label: string; min: number; max: number }>;
  min?: number;
  max?: number;
  step?: number;
  answer?: any;
}

const initialState: AssessmentState = {
  currentAssessment: null,
  sections: null,
  currentSection: null,
  questions: null,
  questionsLoading: false,
  localAnswers: {},
  isSubmitting: false,
  submitError: null,
  results: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const startAssessment = createAsyncThunk<
  AssessmentStartResponse,
  void,
  { rejectValue: string }
>('assessment/start', async (_, { rejectWithValue }) => {
  try {
    return await assessmentApi.startAssessment();
  } catch (error: any) {
    if (error.response?.status === 403) {
      return rejectWithValue('COOLDOWN_ACTIVE');
    }
    return rejectWithValue(error.response?.data?.message || 'Failed to start assessment');
  }
});

export const getCurrentAssessment = createAsyncThunk<
  AssessmentStartResponse | null,
  void,
  { rejectValue: string }
>('assessment/getCurrent', async (_, { rejectWithValue }) => {
  try {
    console.log('getCurrentAssessment API call');
    const result = await assessmentApi.getCurrentAssessment();
    console.log('getCurrentAssessment API response:', result);
    return result;
  } catch (error: any) {
    console.error('getCurrentAssessment API error:', error);
    console.error('Error response:', error.response);
    return rejectWithValue(error.response?.data?.message || error.message || 'Failed to get current assessment');
  }
});

export const getSections = createAsyncThunk<
  SectionsResponse,
  string,
  { rejectValue: string }
>('assessment/getSections', async (assessmentId, { rejectWithValue }) => {
  try {
    console.log('getSections API call for assessment:', assessmentId);
    const result = await assessmentApi.getSections(assessmentId);
    console.log('getSections API response:', result);
    return result;
  } catch (error: any) {
    console.error('getSections API error:', error);
    console.error('Error response:', error.response);
    return rejectWithValue(error.response?.data?.message || error.message || 'Failed to get sections');
  }
});

export const getQuestions = createAsyncThunk<
  QuestionsResponse,
  { assessmentId: string; section: string },
  { rejectValue: string }
>('assessment/getQuestions', async ({ assessmentId, section }, { rejectWithValue }) => {
  try {
    return await assessmentApi.getQuestions(assessmentId, section);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to get questions');
  }
});

export const saveAnswers = createAsyncThunk<
  SaveAnswersResponse,
  { assessmentId: string; answers: Array<{ question: string; data: any }> },
  { rejectValue: string }
>('assessment/saveAnswers', async ({ assessmentId, answers }, { rejectWithValue }) => {
  try {
    return await assessmentApi.saveAnswers(assessmentId, answers);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to save answers');
  }
});

export const submitAssessment = createAsyncThunk<
  SubmitResponse,
  string,
  { rejectValue: MissingAnswersError | string }
>('assessment/submit', async (assessmentId, { rejectWithValue }) => {
  try {
    return await assessmentApi.submitAssessment(assessmentId);
  } catch (error: any) {
    if (error.response?.status === 400) {
      return rejectWithValue(error.response.data as MissingAnswersError);
    }
    return rejectWithValue(error.response?.data?.message || 'Failed to submit assessment');
  }
});

export const getResults = createAsyncThunk<
  AssessmentResult,
  string,
  { rejectValue: string }
>('assessment/getResults', async (assessmentId, { rejectWithValue }) => {
  try {
    return await assessmentApi.getResults(assessmentId);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to get results');
  }
});

// Slice
const assessmentSlice = createSlice({
  name: 'assessment',
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
      state.submitError = null;
    },

    // Set current section
    setCurrentSection: (state, action: PayloadAction<string>) => {
      state.currentSection = action.payload;
      state.questions = null; // Clear questions when switching sections
    },

    // Update local answer
    updateLocalAnswer: (state, action: PayloadAction<{ questionCode: string; value: any }>) => {
      const { questionCode, value } = action.payload;
      state.localAnswers[questionCode] = value;
    },

    // Clear local answers
    clearLocalAnswers: (state) => {
      state.localAnswers = {};
    },

    // Reset assessment state
    resetAssessment: (state) => {
      state.currentAssessment = null;
      state.sections = null;
      state.currentSection = null;
      state.questions = null;
      state.localAnswers = {};
      state.results = null;
      state.error = null;
      state.submitError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Start assessment
      .addCase(startAssessment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(startAssessment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentAssessment = action.payload;
        state.error = null;
      })
      .addCase(startAssessment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to start assessment';
      })

      // Get current assessment
      .addCase(getCurrentAssessment.fulfilled, (state, action) => {
        state.currentAssessment = action.payload;
      })

      // Get sections
      .addCase(getSections.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getSections.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sections = action.payload;
        state.error = null;
      })
      .addCase(getSections.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to get sections';
      })

      // Get questions
      .addCase(getQuestions.pending, (state) => {
        state.questionsLoading = true;
        state.error = null;
      })
      .addCase(getQuestions.fulfilled, (state, action) => {
        state.questionsLoading = false;
        state.questions = action.payload.questions;
        state.currentSection = action.payload.section;
        state.error = null;
      })
      .addCase(getQuestions.rejected, (state, action) => {
        state.questionsLoading = false;
        state.error = action.payload || 'Failed to get questions';
      })

      // Save answers
      .addCase(saveAnswers.fulfilled, (state, action) => {
        // Update progress from API response
        if (state.sections) {
          state.sections.progress = action.payload.progress;
        }
        // Clear saved answers from localAnswers as they're now persisted
        const savedQuestionCodes = action.meta.arg.answers?.map((a: any) => a.question) || [];
        savedQuestionCodes.forEach((code: string) => {
          delete state.localAnswers[code];
        });
      })

      // Submit assessment
      .addCase(submitAssessment.pending, (state) => {
        state.isSubmitting = true;
        state.submitError = null;
      })
      .addCase(submitAssessment.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.currentAssessment = action.payload;
        state.submitError = null;
      })
      .addCase(submitAssessment.rejected, (state, action) => {
        state.isSubmitting = false;
        state.submitError = typeof action.payload === 'string' ? action.payload : 'Missing required answers';
      })

      // Get results
      .addCase(getResults.fulfilled, (state, action) => {
        state.results = action.payload;
      });
  },
});

export const {
  clearError,
  setCurrentSection,
  updateLocalAnswer,
  clearLocalAnswers,
  resetAssessment,
} = assessmentSlice.actions;

export default assessmentSlice.reducer;
