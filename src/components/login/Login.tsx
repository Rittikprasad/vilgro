import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "../ui/Input"
import { Button } from "../ui/Button"
import { cn } from "../../lib/utils"
import logo from "../../assets/logo.png"
import { BackgroundGradients } from "../ui/BackgroundGradients"
import { login, fetchOnboardingProgress } from "../../features/auth/authThunks"
import { clearError } from "../../features/auth/authSlice"
import { getCurrentAssessment } from "../../features/assessment/assessmentSlice"
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
  const { isLoading, isAuthenticated, has_completed_profile, onboarding, user } = useSelector((state: RootState) => state.auth)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  // Handle navigation after successful authentication
  useEffect(() => {
    if (isAuthenticated && user) {
      const userRole = user.role?.toUpperCase();
      console.log("User authenticated, checking role and profile completion status...")
      console.log("User role:", userRole)
      console.log("has_completed_profile:", has_completed_profile)
      console.log("onboarding:", onboarding)
      
      // Navigate based on user role
      if (userRole === 'ADMIN') {
        console.log("Admin user authenticated, navigating to admin dashboard")
        navigate("/admin/dashboard", { replace: true })
      } else if (userRole === 'BANK_USER') {
        console.log("Banking user authenticated, navigating to banking dashboard")
        navigate("/banking/dashboard", { replace: true })
      } else if (userRole === 'SPO') {
        // SPO users need profile completion check
        if (has_completed_profile) {
          // Check current assessment's first_time field to determine navigation
          const checkAssessmentAndNavigate = async () => {
            try {
              const currentAssessmentResult = await dispatch(getCurrentAssessment() as any);
              if (getCurrentAssessment.fulfilled.match(currentAssessmentResult) && currentAssessmentResult.payload) {
                const assessment = currentAssessmentResult.payload;
                console.log("Found current assessment:", assessment);
                
                // If first_time is false, redirect to dashboard (user has completed assessment before)
                if (assessment.first_time === false) {
                  console.log("User has completed assessment before (first_time=false), navigating to dashboard");
                  navigate("/assessment/dashboard", { replace: true });
                } else {
                  console.log("User is taking assessment for first time (first_time=true), navigating to assessment");
                  navigate("/assessment", { replace: true });
                }
              } else {
                // No current assessment, navigate to assessment to start new one
                console.log("No current assessment found, navigating to assessment");
                navigate("/assessment", { replace: true });
              }
            } catch (error) {
              console.warn("Failed to check current assessment, defaulting to assessment page:", error);
              navigate("/assessment", { replace: true });
            }
          };
          checkAssessmentAndNavigate();
        } else {
          const currentStep = onboarding?.current_step || 1
          console.log("User hasn't completed profile, navigating to signup step:", currentStep + 1)
          navigate(`/signup/step/${currentStep + 1}`, { replace: true })
        }
      } else {
        console.error("Unknown user role:", userRole)
        navigate("/login", { replace: true })
      }
    }
  }, [isAuthenticated, user, has_completed_profile, onboarding, navigate, dispatch])

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
                <div className="relative">
                  <Input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className={cn(
                      "w-full h-12 px-4 py-3 pr-12 rounded-lg bg-white focus:outline-none focus:ring-0 focus:border-transparent transition-colors",
                      errors.password ? "border-red-500" : "gradient-border"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#46b753] transition-colors cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password.message}</p>
                )}
              </div>
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
                className="text-[14px] villgro-green-text underline hover:underline cursor-pointer font-golos font-[300]"
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
