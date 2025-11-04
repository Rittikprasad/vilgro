/**
 * Question Builder types and interfaces
 * Defines all TypeScript types for question builder functionality
 */

// Admin Section interface
export interface AdminSection {
  id: number;
  code: string;
  title: string;
  order: number;
  weightage: number;
  total_questions: number;
  active_questions: number;
  inactive_questions: number;
}

// Question Option interface
export interface QuestionOption {
  id: number;
  label: string;
  value: string;
  points: string;
}

// Question Dimension interface
export interface QuestionDimension {
  id: number;
  code: string;
  label: string;
  min_value: number;
  max_value: number;
  points_per_unit: string;
  weight: string;
}

// Question Condition interface
export interface QuestionCondition {
  id: number;
  logic: {
    q: string;
    op: string;
    val: string;
  };
}

// Admin Question interface
export interface AdminQuestion {
  id: number;
  section: number;
  code: string;
  text: string;
  help_text: string | null;
  type: string;
  required: boolean;
  order: number;
  max_score: string | null;
  weight: string;
  options: QuestionOption[];
  dimensions: QuestionDimension[];
  conditions: QuestionCondition[];
}

// Admin Sections Response interface
export interface AdminSectionsResponse {
  data: AdminSection[];
}

// Initial Question Builder State interface
export interface IInitialQuestionBuilderState {
  sections: AdminSection[];
  questions: AdminQuestion[];
  questionCodes: QuestionCode[];
  isLoading: boolean;
  questionsLoading: boolean;
  questionCodesLoading: boolean;
  error: string | null;
  questionsError: string | null;
  questionCodesError: string | null;
}

// Question Code interface for conditional branching
export interface QuestionCode {
  code: string;
  text: string;
  type: string;
}

// Question Builder Tab enum
export enum BuilderTab {
  SECTIONS = "sections",
  QUESTIONS = "questions",
  PREVIEW = "preview",
}
