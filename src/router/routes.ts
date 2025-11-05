/**
 * Route configuration
 * Central place to manage all application routes
 */

export const publicRoutes = {
  home: "/",
  login: "/login",
  signup: "/signup",
  forgotPassword: "/forgot-password",
} as const

export const adminRoutes = {
  login: "/signin/admin",
  dashboard: "/admin/dashboard",
  forgotPassword: "/admin/forgot-password",
} as const

export const spoRoutes = {
  assessment: "/assessment",
  dashboard: "/dashboard",
  welcome: "/welcome",
  onboarding: "/onboarding",
} as const

export type PublicRoute = typeof publicRoutes[keyof typeof publicRoutes]
export type AdminRoute = typeof adminRoutes[keyof typeof adminRoutes]
export type SPORoute = typeof spoRoutes[keyof typeof spoRoutes]

