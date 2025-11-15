import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { assessmentApi, type AssessmentStartResponse, type SectionsResponse, type QuestionsResponse, type SaveAnswersResponse, type SubmitResponse, type AssessmentResult, type MissingAnswersError } from '../../services/assessmentApi';
import { adminApi, type QuestionType, type CreateQuestionPayload, type CreateQuestionResponse, type CreateQuestionErrorResponse } from '../../services/adminApi';
import { ApiResponseHandler } from '../../lib/apiResponseHandler';

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
  eligibility: LoanEligibilityResponse | null;
  isReportDownloading: boolean;
  reportError: string | null;
  
  // Admin functionality
  questionTypes: QuestionType[];
  questionTypesLoading: boolean;
  questionTypesError: string | null;
  
  // Create question
  isCreatingQuestion: boolean;
  createQuestionError: string | null;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
}

interface AssessmentQuestion {
  code: string;
  text: string;
  type: 'SINGLE_CHOICE' | 'MULTI_CHOICE' | 'SLIDER' | 'RATING' | 'MULTI_SLIDER';
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
  questionTypes: [],
  questionTypesLoading: false,
  questionTypesError: null,
  isCreatingQuestion: false,
  createQuestionError: null,
  isLoading: false,
  error: null,
  eligibility: null,
  isReportDownloading: false,
  reportError: null,
};

export interface LoanEligibilityResponse {
  assessment_id: number;
  is_eligible: boolean;
  overall_score: number;
  details: {
    sections: Record<
      string,
      {
        raw: number;
        normalized: number;
        min: number;
        max: number;
        weight: number;
        contribution: number;
        gate_pass: boolean;
        criteria: {
          notes: string;
          sub_metrics: string[];
        };
        recommendation: string;
      }
    >;
    weights_sum: number;
    reason: string | null;
    stage: string | null;
  };
}

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

export const getLoanEligibility = createAsyncThunk<
  LoanEligibilityResponse,
  string,
  { rejectValue: string }
>('assessment/getLoanEligibility', async (assessmentId, { rejectWithValue }) => {
  try {
    return await assessmentApi.getLoanEligibility(assessmentId);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to get loan eligibility');
  }
});

export interface AssessmentReportPayload {
  url: string;
  filename: string;
}

export const getAssessmentReport = createAsyncThunk<
  AssessmentReportPayload,
  string | number,
  { rejectValue: string }
>('assessment/getAssessmentReport', async (assessmentId, { rejectWithValue }) => {
  try {
    const response = await assessmentApi.getAssessmentReport(assessmentId);
    const disposition = response.headers["content-disposition"] ?? "";
    const filenameMatch = disposition.match(/filename\*?=(?:UTF-8'')?["']?([^"';\n]+)["']?/i);
    const filename = filenameMatch ? decodeURIComponent(filenameMatch[1]) : `assessment-report-${assessmentId}.pdf`;
    const blobUrl = window.URL.createObjectURL(response.data);
    return { url: blobUrl, filename };
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to download assessment report');
  }
});

// Admin async thunks
export const getQuestionTypes = createAsyncThunk<
  QuestionType[],
  void,
  { rejectValue: string }
>('assessment/getQuestionTypes', async (_, { rejectWithValue }) => {
  try {
    return await adminApi.getQuestionTypes();
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to get question types');
  }
});

export const createQuestion = createAsyncThunk<
  CreateQuestionResponse,
  CreateQuestionPayload,
  { rejectValue: CreateQuestionErrorResponse }
>('assessment/createQuestion', async (payload, { rejectWithValue }) => {
  try {
    return await adminApi.createQuestion(payload);
  } catch (error: any) {
    if (error.response?.status === 400) {
      return rejectWithValue(error.response.data as CreateQuestionErrorResponse);
    }
    return rejectWithValue({
      message: error.response?.data?.message || 'Failed to create question'
    });
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
      state.questionTypesError = null;
      state.createQuestionError = null;
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
      state.eligibility = null;
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
        
        // Update questions array with saved answers to keep both sources in sync
        const savedAnswers = action.meta.arg.answers || [];
        savedAnswers.forEach((answer: any) => {
          const question = state.questions?.find(q => q.code === answer.question);
          if (question) {
            question.answer = answer.data;
          }
        });
        
        // Clear saved answers from localAnswers as they're now persisted
        const savedQuestionCodes = savedAnswers.map((a: any) => a.question);
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
      })

      // Get loan eligibility
      .addCase(getLoanEligibility.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getLoanEligibility.fulfilled, (state, action) => {
        state.isLoading = false;
        state.eligibility = action.payload;
      })
      .addCase(getLoanEligibility.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to get loan eligibility';
      })

      // Get assessment report
      .addCase(getAssessmentReport.pending, (state) => {
        state.isReportDownloading = true;
        state.reportError = null;
      })
      .addCase(getAssessmentReport.fulfilled, (state) => {
        state.isReportDownloading = false;
      })
      .addCase(getAssessmentReport.rejected, (state, action) => {
        state.isReportDownloading = false;
        state.reportError = action.payload || 'Failed to download assessment report';
      })

      // Get question types
      .addCase(getQuestionTypes.pending, (state) => {
        state.questionTypesLoading = true;
        state.questionTypesError = null;
      })
      .addCase(getQuestionTypes.fulfilled, (state, action) => {
        state.questionTypesLoading = false;
        state.questionTypes = action.payload;
        state.questionTypesError = null;
      })
      .addCase(getQuestionTypes.rejected, (state, action) => {
        state.questionTypesLoading = false;
        state.questionTypesError = action.payload || 'Failed to get question types';
      })

      // Create question
      .addCase(createQuestion.pending, (state) => {
        state.isCreatingQuestion = true;
        state.createQuestionError = null;
      })
      .addCase(createQuestion.fulfilled, (state) => {
        state.isCreatingQuestion = false;
        state.createQuestionError = null;
        // Show success notification
        ApiResponseHandler.handleSuccess({ message: "Question created successfully!" });
        // Note: The new question will be added to the questions list by refetching
      })
      .addCase(createQuestion.rejected, (state, action) => {
        state.isCreatingQuestion = false;
        state.createQuestionError = action.payload?.message || 'Failed to create question';
        // Show error notification
        ApiResponseHandler.handleError(action.payload || { message: 'Failed to create question' }, 'Failed to create question');
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
