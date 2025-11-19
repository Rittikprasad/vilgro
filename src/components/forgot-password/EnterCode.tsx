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

// Validation schema for enter code form
const enterCodeSchema = z.object({
  code: z
    .string()
    .min(1, "Code is required")
    .min(6, "Code must be at least 6 characters"),
})

type EnterCodeFormData = z.infer<typeof enterCodeSchema>

/**
 * Enter Code Component - First step of forgot password flow
 * User enters the verification code sent to their email
 */
const EnterCode: React.FC = () => {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EnterCodeFormData>({
    resolver: zodResolver(enterCodeSchema),
  })

  /**
   * Handle form submission
   * @param data - Form data validated by Zod schema
   */
  const onSubmit = async (data: EnterCodeFormData) => {
    try {
      console.log("Code submitted:", data)
      // Navigate to create new password screen
      navigate("/forgot-password/create-new-password")
    } catch (error) {
      console.error("Code submission error:", error)
    }
  }

  /**
   * Handle resend code
   */
  const handleResendCode = () => {
    console.log("Resend code requested")
    // Add resend code logic here
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
                  Enter code
                </label>
              </div>

              {/* Code Input */}
              <div className="space-y-1">
                <Input
                  {...register("code")}
                  type="text"
                  placeholder="Enter code"
                  className={cn(
                    "w-full h-12 px-4 py-3 rounded-lg bg-white",
                    errors.code ? "border-red-500" : "gradient-border"
                  )}
                />
                {errors.code && (
                  <p className="text-red-500 text-sm">{errors.code.message}</p>
                )}
              </div>

              {/* Resend Code Link */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleResendCode}
                  className="text-[14px] villgro-green-text underline hover:underline cursor-pointer font-golos font-[300]"
                >
                  Resend code
                </button>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-[300px] h-12 text-black font-medium rounded-lg gradient-bg hover:opacity-90 transition-opacity"
                >
                  {isSubmitting ? "Verifying..." : "Create new password"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnterCode
