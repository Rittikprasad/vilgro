import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
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
  const { isLoading, error, fieldErrors } = useSelector((state: RootState) => state.signup)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
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
      // Remove previously applied server-side errors before submitting again
      clearErrors()

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

  // Map server-side errors to react-hook-form fields for highlighting
  React.useEffect(() => {
    if (!fieldErrors) {
      return
    }

    const apiToFormFieldMap: Record<string, keyof SignupFormData> = {
      email: "email",
      password: "password",
      confirm_password: "confirmPassword",
      agree_to_terms: "termsAccepted"
    }

    Object.entries(fieldErrors).forEach(([apiField, messages]) => {
      const formField = apiToFormFieldMap[apiField]
      if (!formField) {
        return
      }

      const message = messages?.length ? messages.join(" ") : "Please check this field"
      setError(formField, { type: "server", message })
    })
  }, [fieldErrors, setError])

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
            <h1 className="text-2xl font-[500] text-gray-800 font-['Baskervville']">
              Create an <span className="villgro-green-text font-['Baskervville']">account</span>
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
                  "w-full h-12 px-4 py-3 rounded-lg bg-white gradient-border focus:outline-none focus:ring-0 focus:border-transparent transition-colors",
                  errors.email && "border border-red-500"
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
                    "w-full h-12 px-4 py-3 pr-12 rounded-lg bg-white gradient-border focus:outline-none focus:ring-0 focus:border-transparent transition-colors",
                    errors.password && "border border-red-500"
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

            {/* Confirm Password Input */}
            <div className="space-y-1">
              <div className="relative">
                <Input
                  {...register("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className={cn(
                    "w-full h-12 px-4 py-3 pr-12 rounded-lg bg-white gradient-border focus:outline-none focus:ring-0 focus:border-transparent transition-colors",
                    errors.confirmPassword && "border border-red-500"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#46b753] transition-colors cursor-pointer"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
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
                <span className="text-[12px] font-[300] text-gray-900 font-golos">
                  By checking this box, I consent to the collection and use of my personal data by Villgro for future engagement nd communications.
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
            <span className="text-gray-600 font-golos font-[300] text-[14px]">
              Already have an account?{" "}
              <Link
                to="/login"
                className="villgro-green-text cursor-pointer underline font-medium font-golos"
              >
                Login here
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignupStep1
