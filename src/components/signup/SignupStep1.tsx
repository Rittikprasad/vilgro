import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { Input } from "../ui/Input"
import { Button } from "../ui/Button"
import { cn } from "../../lib/utils"
import logo from "../../assets/logo.png"
import { BackgroundGradients } from "../ui/BackgroundGradients"
import { startSignup, clearError } from "../../features/signup/signupSlice"
import { setAuthData } from "../../features/auth/authSlice"
import type { RootState } from "../../app/store"

// Updated validation schema for Step 1
const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  confirmPassword: z.string(),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions"
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

type SignupFormData = z.infer<typeof signupSchema>;

interface SignupStep1Props {
  onNext?: (data: SignupFormData) => void
}

/**
 * Signup Step 1 Component - Create Account Form
 * Features form validation, gradient styling, and responsive design
 */
const SignupStep1: React.FC<SignupStep1Props> = ({ onNext }) => {
  const dispatch = useDispatch()
  const { isLoading, error } = useSelector((state: RootState) => state.signup)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  })

  // Clear error when component mounts (for Redux state cleanup)
  React.useEffect(() => {
    if (error) {
      dispatch(clearError())
    }
  }, [dispatch, error])

  /**
   * Handle form submission
   * @param data - Form data validated by Zod schema
   */
  const onSubmit = async (data: SignupFormData) => {
    try {
      const signupData = {
        email: data.email,
        password: data.password,
        confirm_password: data.confirmPassword,
        agree_to_terms: data.termsAccepted,
      }

      const result = await dispatch(startSignup(signupData) as any)

      if (startSignup.fulfilled.match(result)) {
        console.log("Signup successful, updating auth state:", result.payload)

        // Update auth state with user and tokens
        dispatch(setAuthData({
          access: result.payload.tokens.access,
          refresh: result.payload.tokens.refresh,
          user: result.payload.user
        }))

        // Signup successful, proceed to next step
        if (onNext) {
          onNext(data)
        }
      }
      // Error handling is now done automatically in the thunk
    } catch (error) {
      console.error("Signup error:", error)
      // Network error handling is now done automatically in the thunk
    }
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background decorative elements */}
      <BackgroundGradients />

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-6">
        <div className="w-full max-w-md space-y-8">
          {/* Logo Section */}
          <div className="flex justify-center items-center">
            <img src={logo} alt="logo" className="object-contain md:w-36 w-24 " />
          </div>

          {/* Form Title */}
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-semibold text-gray-800">
              Create an <span className="villgro-green-text">account</span>
            </h1>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="gap-5 flex flex-col">
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

            {/* Confirm Password Input */}
            <div className="space-y-1">
              <Input
                {...register("confirmPassword")}
                type="password"
                placeholder="Confirm Password"
                className={cn(
                  "w-full h-12 px-4 py-3 rounded-lg bg-white focus:outline-none focus:ring-0 focus:border-transparent transition-colors",
                  errors.confirmPassword ? "border-red-500" : "gradient-border"
                )}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-1">
              <label className="flex items-start space-x-3 text-sm text-gray-600">
                <input
                  {...register("termsAccepted")}
                  type="checkbox"
                  className="custom-checkbox mt-1"
                />
                <span className="text-[12px] text-gray-600">
                  Creating an account means you're okay with our{" "}
                  <span className="villgro-green-text cursor-pointer hover:underline">
                    Terms and Conditions
                  </span>{" "}
                  and our default{" "}
                  <span className="villgro-green-text cursor-pointer hover:underline">
                    Notification Settings
                  </span>
                  .
                </span>
              </label>
              {errors.termsAccepted && (
                <p className="text-red-500 text-sm">{errors.termsAccepted.message}</p>
              )}
            </div>

            {/* Error Display - Now handled by notifications */}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 text-black font-medium rounded-lg gradient-bg hover:opacity-90 transition-opacity"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          {/* Login Link */}
          <div className="text-center">
            <span className="text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="villgro-green-text cursor-pointer hover:underline font-medium"
              >
                Login here!
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignupStep1
