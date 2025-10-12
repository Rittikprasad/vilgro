import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useNavigate } from "react-router-dom"
import { Input } from "../ui/Input"
import { Button } from "../ui/Button"
import { cn } from "../../lib/utils"
import logo from "../../assets/logo.png"
import { BackgroundGradients } from "../ui/BackgroundGradients"

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
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateNewPasswordFormData>({
    resolver: zodResolver(createNewPasswordSchema),
  })

  /**
   * Handle form submission
   * @param data - Form data validated by Zod schema
   */
  const onSubmit = async (data: CreateNewPasswordFormData) => {
    try {
      console.log("New password created:", data)
      // Navigate back to login screen
      navigate("/login")
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
              <img src={logo} alt="logo" className="object-contain w-[173.238px] h-[71.721px]" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-1">
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="123@organization.com"
                  className={cn(
                    "w-[512px] h-12 px-4 py-3 rounded-lg bg-white border border-[#46b753] focus:outline-none focus:ring-0 focus:border-[#46b753] text-[16px] placeholder:text-[#a8a8a8]",
                    errors.email && "border-red-500"
                  )}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              {/* New Password Input */}
              <div className="space-y-1">
                <Input
                  {...register("newPassword")}
                  type="password"
                  placeholder="Create new password"
                  className={cn(
                    "w-[512px] h-12 px-4 py-3 rounded-lg bg-white border border-[#46b753] focus:outline-none focus:ring-0 focus:border-[#46b753] text-[16px] placeholder:text-[#a8a8a8]",
                    errors.newPassword && "border-red-500"
                  )}
                />
                {errors.newPassword && (
                  <p className="text-red-500 text-sm">{errors.newPassword.message}</p>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-1">
                <Input
                  {...register("confirmPassword")}
                  type="password"
                  placeholder="Confirm new password"
                  className={cn(
                    "w-[512px] h-12 px-4 py-3 rounded-lg bg-white border border-[#46b753] focus:outline-none focus:ring-0 focus:border-[#46b753] text-[16px] placeholder:text-[#a8a8a8]",
                    errors.confirmPassword && "border-red-500"
                  )}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-center w-[512px]">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-[312px] h-12 text-black font-normal text-[16px] rounded-lg gradient-bg hover:opacity-90 transition-opacity"
                >
                  {isSubmitting ? "Creating..." : "Confirm & Login again"}
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
