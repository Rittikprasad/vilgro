import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "../ui/Input"
import { Button } from "../ui/Button"
import { cn } from "../../lib/utils"
import logo from "../../assets/logo.png"
import { BackgroundGradients } from "../ui/BackgroundGradients"
import { resetPassword } from "../../features/auth/authThunks"
import { clearError } from "../../features/auth/authSlice"
import type { RootState } from "../../app/store"

// Validation schema for create new password form
const createNewPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

type CreateNewPasswordFormData = z.infer<typeof createNewPasswordSchema>

/**
 * Create New Password Component - Second step of forgot password flow
 * User creates a new password and confirms it
 */
const CreateNewPassword: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isLoading, error, forgotPasswordEmail } = useSelector((state: RootState) => state.auth)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CreateNewPasswordFormData>({
    resolver: zodResolver(createNewPasswordSchema),
  })

  // Set email from Redux state if available
  useEffect(() => {
    if (forgotPasswordEmail) {
      setValue("email", forgotPasswordEmail)
    } else {
      // If no email in state, redirect back to enter email
      navigate("/forgot-password")
    }
  }, [forgotPasswordEmail, setValue, navigate])

  /**
   * Handle form submission
   * @param data - Form data validated by Zod schema
   */
  const onSubmit = async (data: CreateNewPasswordFormData) => {
    try {
      console.log("New password created:", data)
      
      if (!forgotPasswordEmail) {
        // If no email in state, redirect back to enter email
        navigate("/forgot-password")
        return
      }

      // Clear any previous errors
      dispatch(clearError())

      // Call reset password API
      const result = await dispatch(
        resetPassword({
          email: forgotPasswordEmail,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
        }) as any
      )

      if (resetPassword.fulfilled.match(result)) {
        // Navigate back to login screen on success
        navigate("/login")
      }
      // Error handling is done automatically in the thunk
    } catch (error) {
      console.error("Password creation error:", error)
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
              {/* Email Input - Read only, pre-filled from state */}
              <div className="space-y-1">
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="Enter Email ID"
                  disabled
                  className={cn(
                    "w-full h-12 px-4 py-3 rounded-lg bg-gray-50 cursor-not-allowed",
                    errors.email ? "border-red-500" : "gradient-border"
                  )}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              {/* New Password Input */}
              <div className="space-y-1">
                <div className="relative">
                  <Input
                    {...register("newPassword")}
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Create new Password"
                    className={cn(
                      "w-full h-12 px-4 py-3 pr-12 rounded-lg bg-white focus:outline-none focus:ring-0 focus:border-transparent transition-colors",
                      errors.newPassword ? "border-red-500" : "gradient-border"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#46b753] transition-colors cursor-pointer"
                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-red-500 text-sm">{errors.newPassword.message}</p>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-1">
                <div className="relative">
                  <Input
                    {...register("confirmPassword")}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new Password"
                    className={cn(
                      "w-full h-12 px-4 py-3 pr-12 rounded-lg bg-white focus:outline-none focus:ring-0 focus:border-transparent transition-colors",
                      errors.confirmPassword ? "border-red-500" : "gradient-border"
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
                  {isLoading ? "Resetting..." : "Confirm & Login again"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateNewPassword
