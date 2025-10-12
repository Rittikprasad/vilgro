import api from './api';

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
  by_section: Record<string, { answered: number; required: number }>;
}

export interface AssessmentStartResponse {
  id: string;
  status: 'DRAFT' | 'SUBMITTED' | 'COOLDOWN';
  cooldown_until?: string;
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
  type: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'SLIDER' | 'RATING' | 'MULTI_SLIDER';
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
  id: string;
  scores: Record<string, number>;
  submitted_at: string;
  cooldown_until?: string;
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

  // Get assessment history
  getHistory: async (): Promise<AssessmentHistory> => {
    const response = await api.get('/assessments/history');
    return response.data;
  },
};
