import api from './api';
import { endpoints } from './endpoints';

// Types for question types API
export interface QuestionType {
  value: string;
  label: string;
}

// Types for create question API
export interface CreateQuestionPayload {
  section: number | string;
  sector: string;
  code: string;
  text: string;
  type: 'SINGLE_CHOICE' | 'MULTI_CHOICE' | 'SLIDER' | 'MULTI_SLIDER' | 'RATING' | 'NPS';
  required: boolean;
  order: number;
  weight: string;
  is_active?: boolean;
  options?: Array<{ label: string; value: string; points: string }>;
  dimensions?: Array<{ code: string; label: string; min_value: number; max_value: number; points_per_unit: number; weight: number }>;
  conditions?: Array<{
    logic: Record<string, any>;
  }>;
}

export interface CreateQuestionResponse {
  id: string;
  section: string;
  code: string;
  text: string;
  type: string;
  required: boolean;
  order: number;
  weight: string;
  is_active?: boolean;
  options?: Array<{ label: string; value: string; points: string }>;
  dimensions?: Array<{ code: string; label: string; min_value: number; max_value: number; points_per_unit: number; weight: number }>;
  created_at: string;
  updated_at: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface CreateQuestionErrorResponse {
  message: string;
  errors?: ValidationError[];
}

/**
 * Admin API service
 * Handles all admin-related API calls
 */
export const adminApi = {
  /**
   * Get question types
   * Returns available question types for creating questions
   */
  getQuestionTypes: async (): Promise<QuestionType[]> => {
    const response = await api.get(endpoints.admin.questionTypes);
    return response.data;
  },

  /**
   * Create a new question
   * Creates a question with type-specific payload
   */
  createQuestion: async (payload: CreateQuestionPayload): Promise<CreateQuestionResponse> => {
    const response = await api.post(endpoints.admin.createQuestion, payload);
    return response.data;
  },
  
  /**
   * Update an existing question (partial or full)
   */
  updateQuestion: async (
    id: number | string,
    payload: Partial<CreateQuestionPayload>
  ): Promise<CreateQuestionResponse> => {
    const response = await api.patch(endpoints.admin.updateQuestion(id), payload);
    return response.data;
  },

  /**
   * Delete a question by ID
   */
  deleteQuestion: async (id: number | string): Promise<void> => {
    await api.delete(endpoints.admin.deleteQuestion(id));
  },
};
