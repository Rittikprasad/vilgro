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
    login: `${BASE_URL}/auth/login`,
    logout: `${BASE_URL}/auth/logout`,
    refresh: `${BASE_URL}/auth/refresh`,
    profile: `${BASE_URL}/auth/profile`,
    register: `${BASE_URL}/auth/register`,
    forgotPassword: `${BASE_URL}/auth/forgot-password`,
    resetPassword: `${BASE_URL}/auth/reset-password`,
    verifyEmail: `${BASE_URL}/auth/verify-email`,
  },

  // User management endpoints
  users: {
    list: `${BASE_URL}/users`,
    create: `${BASE_URL}/users`,
    getById: (id: string) => `${BASE_URL}/users/${id}`,
    update: (id: string) => `${BASE_URL}/users/${id}`,
    delete: (id: string) => `${BASE_URL}/users/${id}`,
  },

  // Meta options endpoints
  meta: {
    options: `${BASE_URL}/meta/options`,
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
