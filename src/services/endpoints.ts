/**
 * API endpoints configuration
 * Centralized location for all API endpoint definitions
 */

const BASE_URL = "http://13.222.130.172/api";

/**
 * Authentication endpoints
 * Contains all authentication-related API endpoints
 */
export const endpoints = {
  auth: {
    login: `${BASE_URL}/auth/login/`,
    logout: `${BASE_URL}/auth/logout/`,
    refresh: `${BASE_URL}/auth/refresh/`,
    profile: `${BASE_URL}/profile`,
    register: `${BASE_URL}/auth/register/`,
    forgotPassword: `${BASE_URL}/auth/forgot-password/`,
    resetPassword: `${BASE_URL}/auth/reset-password/`,
    verifyEmail: `${BASE_URL}/auth/verify-email/`,
    spoSignupStart: `${BASE_URL}/auth/spo-signup/start/`,
    spoSignupComplete: `${BASE_URL}/auth/spo-signup/complete/`,
  },

  // User management endpoints
  users: {
    list: `${BASE_URL}/users/`,
    create: `${BASE_URL}/users/`,
    getById: (id: string) => `${BASE_URL}/users/${id}/`,
    update: (id: string) => `${BASE_URL}/users/${id}/`,
    delete: (id: string) => `${BASE_URL}/users/${id}/`,
  },

  // Meta options endpoints
  meta: {
    options: `${BASE_URL}/meta/options/`,
  },

  // Onboarding endpoints
  onboarding: {
    getProgress: `${BASE_URL}/onboarding`,
    updateStep: (step: number) => `${BASE_URL}/onboarding/step/${step}`,
    finish: `${BASE_URL}/onboarding/finish`,
  },

  assessment: {
    report: (assessmentId: string | number) =>
      `${BASE_URL}/assessments/${assessmentId}/report.pdf`,
  },

  // Feedback endpoints
  feedback: {
    meta: `${BASE_URL}/feedback/meta`,
    submit: `${BASE_URL}/feedback`,
  },

  // Admin endpoints
  admin: {
    sections: (sector: string) => `${BASE_URL}/admin/sections/?sector=${encodeURIComponent(sector)}`,
    questionsBySection: (sectionCode: string, sector: string) => `${BASE_URL}/admin/questions/by-section/?section=${sectionCode}&sector=${encodeURIComponent(sector)}`,
    questionTypes: `${BASE_URL}/admin/meta/question-types/`,
    questionCodes: (sectionCode: string) => `${BASE_URL}/admin/meta/question-codes/?section=${sectionCode}`,
    createQuestion: `${BASE_URL}/admin/questions/`,
    updateQuestion: (id: number | string) => `${BASE_URL}/admin/questions/${id}/`,
    deleteQuestion: (id: number | string) => `${BASE_URL}/admin/questions/${id}/`,
    dashboardSummary: `${BASE_URL}/admin/dashboard/summary`,
    admins: `${BASE_URL}/admin/admins/`,
    adminById: (id: number | string) => `${BASE_URL}/admin/admins/${id}/`,
    spos: `${BASE_URL}/admin/spos/`,
    spoById: (id: number | string) => `${BASE_URL}/admin/spos/${id}/`,
    spoReport: (id: number | string) => `${BASE_URL}/admin/spos/${id}/report/`,
    spoAssessmentResponses: (spoId: number | string, assessmentId: number | string) =>
      `${BASE_URL}/admin/spos/${spoId}/assessments/${assessmentId}/qa/`,
    banks: `${BASE_URL}/admin/banks/`,
    bankById: (id: number | string) => `${BASE_URL}/admin/banks/${id}/`,
    reviews: `${BASE_URL}/admin/reviews/`,
    audit: `${BASE_URL}/admin/audit/`,
    sectorSummary: `${BASE_URL}/admin/questions/sector-summary/`,
    addSector: `${BASE_URL}/admin/questions/add-sector/`,
    editSector: `${BASE_URL}/admin/questions/edit-sector/`,
    deleteSector: `${BASE_URL}/admin/questions/delete-sector/`,
  },

  loan: {
    eligibility: (assessmentId: string | number) =>
      `${BASE_URL}/loan/eligibility/?assessment_id=${assessmentId}`,
    meta: `${BASE_URL}/loan/meta/`,
    prefill: (assessmentId: number) =>
      `${BASE_URL}/loan/prefill/?assessment_id=${assessmentId}`,
    submit: `${BASE_URL}/loan/`,
  },

  // Banking endpoints
  bank: {
    spos: `${BASE_URL}/bank/spos/`,
    spoById: (id: number | string) => `${BASE_URL}/bank/spos/${id}/`,
    spoReport: (id: number | string) => `${BASE_URL}/bank/spos/${id}/report/`,
  },

  // Add more endpoint categories as needed
  // Example:
  // posts: {
  //   list: `${BASE_URL}/posts`,
  //   create: `${BASE_URL}/posts`,
  //   getById: (id: string) => `${BASE_URL}/posts/${id}`,
  //   update: (id: string) => `${BASE_URL}/posts/${id}`,
  //   delete: (id: string) => `${BASE_URL}/posts/${id}`,
  // },
} as const;
