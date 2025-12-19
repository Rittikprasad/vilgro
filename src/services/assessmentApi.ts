import api from './api';
import { endpoints } from './endpoints';

// Types
export interface AssessmentSection {
  code: string;
  title: string;
  progress: {
    answered: number;
    required: number;
  };
}

export interface AssessmentProgress {
  answered: number;
  required: number;
  percent: number;
  by_section: Record<string, { answered: number; required: number }>;
}

export interface AssessmentStartResponse {
  id: string | number;
  status: 'DRAFT' | 'SUBMITTED' | 'COOLDOWN';
  started_at?: string;
  submitted_at?: string | null;
  cooldown_until?: string | null;
  progress?: {
    answered: number;
    required: number;
    percent: number;
    by_section: Record<string, { answered: number; required: number }>;
  };
  scores?: Record<string, any>;
  graph?: {
    scores: {
      overall: number | null;
      sections: {
        RISK: number | null;
        IMPACT: number | null;
        RETURN: number | null;
      };
    };
    plot: {
      x: string;
      y: string;
      z: string;
    };
  };
  sector?: string;
  instrument?: string | null;
  instrument_description?: string | null;
  resume?: {
    last_section: string | null;
  };
  first_time: boolean;
}

export interface QuestionOption {
  label: string;
  value: string;
  points: string;
}

export interface QuestionDimension {
  code: string;
  label: string;
  min: number;
  max: number;
}

export interface QuestionAnswer {
  value?: string;
  values?: Record<string, number | string[]>;
}

export interface AssessmentQuestion {
  code: string;
  text: string;
  type: 'SINGLE_CHOICE' | 'MULTI_CHOICE' | 'SLIDER' | 'RATING' | 'MULTI_SLIDER';
  required: boolean;
  options?: QuestionOption[];
  dimensions?: QuestionDimension[];
  min?: number;
  max?: number;
  step?: number;
  answer?: QuestionAnswer;
}

export interface SectionsResponse {
  sections: AssessmentSection[];
  progress: {
    answered: number;
    required: number;
    percent: number;
  };
}

export interface QuestionsResponse {
  section: string;
  questions: AssessmentQuestion[];
}

export interface SaveAnswersRequest {
  answers: Array<{
    question: string;
    data: QuestionAnswer;
  }>;
}

export interface SaveAnswersResponse {
  progress: AssessmentProgress;
}

export interface SubmitResponse {
  id: string;
  status: 'SUBMITTED';
  scores: Record<string, number>;
  cooldown_until: string;
}

export interface MissingAnswersError {
  detail: string;
  sections: string[];
}

export interface AssessmentResult {
  id: number;
  status: string;
  started_at: string;
  submitted_at: string;
  cooldown_until: string;
  progress: {
    percent: number;
    answered: number;
    required: number;
    by_section: Record<string, { answered: number; required: number }>;
    last_section: string;
  };
  scores: {
    sections: {
      RISK: number;
      IMPACT: number;
      RETURN: number;
      SECTOR_MATURITY: number;
    };
    overall: number;
  };
  graph: {
    scores: {
      overall: number;
      sections: {
        RISK: number;
        IMPACT: number;
        RETURN: number;
        SECTOR_MATURITY: number;
      };
    };
    plot: {
      x: string;
      y: string;
      z: string;
    };
  };
  sector?: string;
  instrument?: string;
  instrument_description?: string;
}

export interface AssessmentHistory {
  assessments: Array<{
    id: string;
    scores: Record<string, number>;
    submitted_at: string;
    status: 'SUBMITTED';
  }>;
}

// API Functions
export const assessmentApi = {
  // Start or resume assessment
  startAssessment: async (): Promise<AssessmentStartResponse> => {
    const response = await api.post('/assessments/start');
    return response.data;
  },

  // Get current assessment
  getCurrentAssessment: async (): Promise<AssessmentStartResponse | null> => {
    try {
      const response = await api.get('/assessments/current');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // Get sections and progress
  getSections: async (assessmentId: string): Promise<SectionsResponse> => {
    const response = await api.get(`/assessments/${assessmentId}/sections`);
    return response.data;
  },

  // Get questions for a section
  getQuestions: async (assessmentId: string, section: string): Promise<QuestionsResponse> => {
    const response = await api.get(`/assessments/${assessmentId}/questions?section=${section}`);
    return response.data;
  },

  // Save answers
  saveAnswers: async (assessmentId: string, answers: SaveAnswersRequest['answers']): Promise<SaveAnswersResponse> => {
    const response = await api.patch(`/assessments/${assessmentId}/answers`, { answers });
    return response.data;
  },

  // Submit assessment
  submitAssessment: async (assessmentId: string): Promise<SubmitResponse> => {
    const response = await api.post(`/assessments/${assessmentId}/submit`);
    return response.data;
  },

  // Get results
  getResults: async (assessmentId: string): Promise<AssessmentResult> => {
    const response = await api.get(`/assessments/${assessmentId}/results`);
    return response.data;
  },

  // Download assessment report
  getAssessmentReport: async (assessmentId: string | number) => {
    return await api.get(endpoints.assessment.report(assessmentId), {
      responseType: "blob",
    });
  },

  // Get loan eligibility
  getLoanEligibility: async (assessmentId: string | number) => {
    const response = await api.get(endpoints.loan.eligibility(assessmentId));
    return response.data;
  },

  // Get assessment history
  getHistory: async (): Promise<AssessmentHistory> => {
    const response = await api.get('/assessments/history');
    const data = response.data;

    // Backend may return either a plain array or an object with `assessments`
    if (Array.isArray(data)) {
      return { assessments: data };
    }

    return {
      assessments: Array.isArray(data?.assessments) ? data.assessments : [],
    };
  },
};

// Feedback types
export interface FeedbackReason {
  key: string;
  label: string;
}

export interface FeedbackMetaResponse {
  reasons: FeedbackReason[];
}

export interface FeedbackSubmitRequest {
  assessment: number | string;
  reasons: string[];
  comment?: string;
}

export interface FeedbackSubmitResponse {
  message?: string;
}

// Feedback API functions
export const feedbackApi = {
  // Get feedback meta (reasons)
  getFeedbackMeta: async (): Promise<FeedbackMetaResponse> => {
    const response = await api.get(endpoints.feedback.meta);
    return response.data;
  },

  // Submit feedback
  submitFeedback: async (payload: FeedbackSubmitRequest): Promise<FeedbackSubmitResponse> => {
    const response = await api.post(endpoints.feedback.submit, payload);
    return response.data;
  },
};
