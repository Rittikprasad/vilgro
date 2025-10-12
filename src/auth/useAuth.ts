import { useSelector } from "react-redux"
import type { RootState } from "../app/store"

/**
 * Custom hook to access authentication state and user role
 * @returns Auth state including user, role, and authentication status
 */
export const useAuth = () => {
  const auth = useSelector((state: RootState) => state.auth)
  
  return {
    user: auth.user,
    role: auth.user?.role || null,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    accessToken: auth.accessToken,
    refreshToken: auth.refreshToken,
    has_completed_profile: auth.has_completed_profile,
    onboarding: auth.onboarding,
  }
}

