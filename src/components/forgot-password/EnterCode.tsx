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
      navigate("/create-new-password")
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
              <img src={logo} alt="logo" className="object-contain w-[173.238px] h-[71.721px]" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Code Input */}
              <div className="space-y-1">
                <Input
                  {...register("code")}
                  type="text"
                  placeholder="Enter code"
                  className={cn(
                    "w-[512px] h-12 px-4 py-3 rounded-lg bg-white border border-[#46b753] focus:outline-none focus:ring-0 focus:border-[#46b753] text-[16px] placeholder:text-[#a8a8a8]",
                    errors.code && "border-red-500"
                  )}
                />
                {errors.code && (
                  <p className="text-red-500 text-sm">{errors.code.message}</p>
                )}
              </div>

              {/* Resend Code Link */}
              <div className="w-[512px] flex justify-end">
                <button
                  onClick={handleResendCode}
                  className="text-[14px] text-[#46b753] underline hover:underline cursor-pointer"
                >
                  Resent code
                </button>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center w-[512px]">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-[300px] h-12 text-white font-normal text-[16px] rounded-lg gradient-bg hover:opacity-90 transition-opacity"
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
