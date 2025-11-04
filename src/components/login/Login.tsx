import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Input } from "../ui/Input"
import { Button } from "../ui/Button"
import { cn } from "../../lib/utils"
import logo from "../../assets/logo.png"
import { BackgroundGradients } from "../ui/BackgroundGradients"
import { login, fetchOnboardingProgress } from "../../features/auth/authThunks"
import { clearError } from "../../features/auth/authSlice"
import type { RootState } from "../../app/store"

// Validation schema for login form
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required"),
})

type LoginFormData = z.infer<typeof loginSchema>

/**
 * Login Component - User authentication form
 * Features same design as SignupStep1 with login-specific fields
 */
const Login: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoading, error, isAuthenticated, has_completed_profile, onboarding } = useSelector((state: RootState) => state.auth)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  // Handle navigation after successful authentication
  useEffect(() => {
    if (isAuthenticated) {
      console.log("User authenticated, checking profile completion status...")
      console.log("has_completed_profile:", has_completed_profile)
      console.log("onboarding:", onboarding)
      
      if (has_completed_profile) {
        console.log("User has completed profile, navigating to assessment")
        navigate("/assessment", { replace: true })
      } else {
        const currentStep = onboarding?.current_step || 1
        console.log("User hasn't completed profile, navigating to signup step:", currentStep + 1)
        navigate(`/signup/step/${currentStep + 1}`, { replace: true })
      }
    }
  }, [isAuthenticated, has_completed_profile, onboarding, navigate])

  /**
   * Handle form submission
   * @param data - Form data validated by Zod schema
   */
  const onSubmit = async (data: LoginFormData) => {
    try {
      console.log("Login form submitted:", data)

      // Clear any previous errors
      dispatch(clearError())

      // Dispatch login action
      const result = await dispatch(login(data) as any)

      if (login.fulfilled.match(result)) {
        console.log("Login successful:", result.payload)

        // Fetch latest onboarding progress to get current step and draft data
        try {
          const onboardingResult = await dispatch(fetchOnboardingProgress() as any)

          if (fetchOnboardingProgress.fulfilled.match(onboardingResult)) {
            console.log("Onboarding progress fetched:", onboardingResult.payload)
          }
        } catch (onboardingError) {
          console.warn("Failed to fetch onboarding progress:", onboardingError)
          // Continue with login flow even if onboarding fetch fails
        }

        // Navigation will be handled by useEffect when authentication state changes
        console.log("Login completed, navigation will be handled by useEffect")
      }
      // Error handling is now done automatically in the thunk
    } catch (error) {
      console.error("Login error:", error)
      // Network error handling is now done automatically in the thunk
    }
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background decorative elements */}
      <BackgroundGradients />

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen px-6">
        <div className="w-full max-w-4xl flex justify-center">
          <div className="w-full max-w-md">
            {/* Logo Section */}
            <div className="flex justify-center items-center mb-8">
              <img src={logo} alt="logo" className="object-contain md:w-36 w-24" />
            </div>

            {/* Form Title */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-[500] text-gray-800 font-['Baskervville']">
                Log in into <span className="villgro-green-text font-['Baskervville']">account</span>
              </h1>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-1">
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="Email ID"
                  className={cn(
                    "w-full h-12 px-4 py-3 rounded-lg bg-white ",
                    errors.email ? "border-red-500" : "gradient-border"
                  )}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <Input
                  {...register("password")}
                  type="password"
                  placeholder="Password"
                  className={cn(
                    "w-full h-12 px-4 py-3 rounded-lg bg-white focus:outline-none focus:ring-0 focus:border-transparent transition-colors",
                    errors.password ? "border-red-500" : "gradient-border"
                  )}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password.message}</p>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-center">
                  <p className="text-red-500 text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-center">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-[300px] h-12 text-black font-medium rounded-lg gradient-bg hover:opacity-90 transition-opacity"
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </div>
            </form>

            {/* Forget Password Link */}
            <div className="text-center mt-6">
              <Link
                to="/forgot-password"
                className="text-[14px] villgro-green-text underline hover:underline cursor-pointer font-golos font-[300] text-[14px]"
              >
                Forgot Password
              </Link>
            </div>

            {/* Sign up Link */}
            <div className="text-center mt-8">
              <span className="text-gray-600 font-golos font-[300] text-[14px]">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="villgro-green-text cursor-pointer underline font-medium font-golos text-[14px] font-[300]"
                >
                  Sign up here
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
