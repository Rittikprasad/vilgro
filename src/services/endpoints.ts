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
    profile: `${BASE_URL}/auth/profile/`,
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

  // Admin endpoints
  admin: {
    sections: `${BASE_URL}/admin/sections/`,
    questionsBySection: (sectionCode: string) => `${BASE_URL}/admin/questions/by-section/?section=${sectionCode}`,
    questionTypes: `${BASE_URL}/admin/meta/question-types/`,
    questionCodes: (sectionCode: string) => `${BASE_URL}/admin/meta/question-codes/?section=${sectionCode}`,
    createQuestion: `${BASE_URL}/admin/questions/`,
    updateQuestion: (id: number | string) => `${BASE_URL}/admin/questions/${id}/`,
    deleteQuestion: (id: number | string) => `${BASE_URL}/admin/questions/${id}/`,
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
