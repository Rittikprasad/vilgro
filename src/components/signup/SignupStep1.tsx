import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signupSchema, type SignupFormData } from "../../lib/validations"
import { Input } from "../ui/Input"
import { Button } from "../ui/Button"
import { cn } from "../../lib/utils"
import logo from "../../assets/logo.png"
import { BackgroundGradients } from "../ui/BackgroundGradients"

interface SignupStep1Props {
  onNext?: (data: SignupFormData) => void
}

/**
 * Signup Step 1 Component - Create Account Form
 * Features form validation, gradient styling, and responsive design
 */
const SignupStep1: React.FC<SignupStep1Props> = ({ onNext }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  })

  /**
   * Handle form submission
   * @param data - Form data validated by Zod schema
   */
  const onSubmit = async (data: SignupFormData) => {
    try {
      console.log("Form submitted:", data)
      if (onNext) {
        onNext(data)
      }
    } catch (error) {
      console.error("Signup error:", error)
    }
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background decorative elements */}
      <BackgroundGradients />

      {/* Header */}
      {/* <div className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
        <span className="text-lg font-medium">Sign up</span>
        <div className="text-xl">&lt;/&gt;</div>
      </div> */}

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
                  className="mt-1 h-4 w-4 text-[#46B753] focus:ring-[#46B753] border-gray-300 rounded"
                />
                <span>
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

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 text-white font-medium rounded-lg gradient-bg hover:opacity-90 transition-opacity"
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          {/* Login Link */}
          <div className="text-center">
            <span className="text-gray-600">
              Already have an account?{" "}
              <span className="villgro-green-text cursor-pointer hover:underline font-medium">
                Login here!
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignupStep1
