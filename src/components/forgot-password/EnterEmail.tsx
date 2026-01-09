import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Input } from "../ui/Input"
import { Button } from "../ui/Button"
import { cn } from "../../lib/utils"
import logo from "../../assets/logo.png"
import { BackgroundGradients } from "../ui/BackgroundGradients"
import { forgotPassword } from "../../features/auth/authThunks"
import { clearError } from "../../features/auth/authSlice"
import type { RootState } from "../../app/store"

// Validation schema for enter email form
const enterEmailSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
})

type EnterEmailFormData = z.infer<typeof enterEmailSchema>

/**
 * Enter Email Component - First step of forgot password flow
 * User enters their registered email to receive a verification code
 */
const EnterEmail: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isLoading, error } = useSelector((state: RootState) => state.auth)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EnterEmailFormData>({
    resolver: zodResolver(enterEmailSchema),
  })

  /**
   * Handle form submission
   * @param data - Form data validated by Zod schema
   */
  const onSubmit = async (data: EnterEmailFormData) => {
    try {
      console.log("Email submitted:", data)
      
      // Clear any previous errors
      dispatch(clearError())

      // Call forgot password API
      const result = await dispatch(forgotPassword({ email: data.email }) as any)

      if (forgotPassword.fulfilled.match(result)) {
        // Navigate to enter code screen on success
        navigate("/forgot-password/enter-code")
      }
      // Error handling is done automatically in the thunk
    } catch (error) {
      console.error("Email submission error:", error)
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

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Label */}
              <div className="mb-2">
                <label className="text-gray-800 font-golos text-base font-[300] text-[14px]">
                  Enter your registered email
                </label>
              </div>

              {/* Email Input */}
              <div className="space-y-1">
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="Enter Email ID"
                  className={cn(
                    "w-full h-12 px-4 py-3 rounded-lg bg-white",
                    errors.email ? "border-red-500" : "gradient-border"
                  )}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-red-500 text-sm text-center">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-center">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-[300px] h-12 text-black font-medium rounded-lg gradient-bg hover:opacity-90 transition-opacity"
                >
                  {isLoading ? "Sending..." : "Send code to email"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnterEmail
