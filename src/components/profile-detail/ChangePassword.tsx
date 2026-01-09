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
import Navbar from "../ui/Navbar"
import { changePassword } from "../../features/auth/authThunks"
import type { RootState } from "../../app/store"

// Validation schema for change password form
const changePasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  currentPassword: z.string().min(1, "Current password is required"),
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

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>

/**
 * Change Password Component
 * Allows authenticated users to change their password
 */
const ChangePassword: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user, isLoading } = useSelector((state: RootState) => state.auth)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  })

  // Set email from user profile
  useEffect(() => {
    if (user?.email) {
      setValue("email", user.email)
    }
  }, [user, setValue])

  /**
   * Handle form submission
   * @param data - Form data validated by Zod schema
   */
  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      console.log("Change password submitted:", data)

      // Call change password API
      const result = await dispatch(
        changePassword({
          current_password: data.currentPassword,
          new_password: data.newPassword,
          confirm_password: data.confirmPassword,
        }) as any
      )

      if (changePassword.fulfilled.match(result)) {
        // Navigate back to profile after successful password change
        navigate(-1)
      }
      // Error handling is done automatically in the thunk via ApiResponseHandler (shows notifications)
    } catch (error) {
      console.error("Password change error:", error)
    }
  }

  return (
    <>
      <Navbar />
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
                {/* Email Input - Read only, pre-filled from user profile */}
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

                {/* Current Password Input */}
                <div className="space-y-1">
                  <div className="relative">
                    <Input
                      {...register("currentPassword")}
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Enter Password"
                      className={cn(
                        "w-full h-12 px-4 py-3 pr-12 rounded-lg bg-white focus:outline-none focus:ring-0 focus:border-transparent transition-colors",
                        errors.currentPassword ? "border-red-500" : "gradient-border"
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#46b753] transition-colors cursor-pointer"
                      aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.currentPassword && (
                    <p className="text-red-500 text-sm">{errors.currentPassword.message}</p>
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

                {/* Submit Button */}
                <div className="flex justify-center">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-[300px] h-12 text-black font-medium rounded-lg gradient-bg hover:opacity-90 transition-opacity"
                  >
                    {isLoading ? "Changing..." : "Change Password"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ChangePassword

