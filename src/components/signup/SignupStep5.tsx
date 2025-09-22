import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Input } from "../ui/Input"
import { Button } from "../ui/Button"
import { RadioGroup, RadioGroupItem } from "../ui/RadioGroup"
import { cn } from "../../lib/utils"
import logo from "../../assets/logo.png"
import ProgressTracker from "../ui/ProgressTracker"

// Validation schema for Step 5
const step5Schema = z.object({
  annualBudget: z.string().min(1, "Annual operating budget is required"),
  fundingSource: z.enum(["funding", "self-assessment"]).refine((val) => val !== undefined, {
    message: "Please select funding source"
  }),
  philanthropicFunding: z.enum(["yes", "no"]).refine((val) => val !== undefined, {
    message: "Please select if you have received philanthropic funding"
  })
})

type Step5FormData = z.infer<typeof step5Schema>

interface SignupStep5Props {
  onComplete: (data: Step5FormData) => void
  onBack: () => void
}

/**
 * Signup Step 5 Component - Final budget and funding questions
 * Collects budget and funding information to complete signup
 */
const SignupStep5: React.FC<SignupStep5Props> = ({ onComplete, onBack }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Step5FormData>({
    resolver: zodResolver(step5Schema),
  })

  const selectedFundingSource = watch("fundingSource")
  const selectedPhilanthropicFunding = watch("philanthropicFunding")

  /**
   * Handle form submission
   * @param data - Form data validated by Zod schema
   */
  const onSubmit = async (data: Step5FormData) => {
    try {
      console.log("Step 5 submitted:", data)
      onComplete(data)
    } catch (error) {
      console.error("Step 5 error:", error)
    }
  }

  return (
    <div className="min-h-screen signup-bg-gradient relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 border-2 border-dotted border-blue-300 rounded-full opacity-30"></div>
        <div className="absolute top-40 right-20 w-24 h-24 border-2 border-dotted border-blue-300 rotate-45 opacity-30"></div>
        <div className="absolute bottom-40 left-20 w-28 h-28 border-2 border-dotted border-blue-300 rounded-full opacity-30"></div>
        <div className="absolute bottom-20 right-10 w-20 h-20 border-2 border-dotted border-blue-300 rotate-12 opacity-30"></div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen px-6 py-8">
        <div className="w-full max-w-2xl">
          {/* Logo Section */}
          <div className="flex justify-end mb-8">
            <img src={logo} alt="logo" className="object-contain w-24" />
          </div>

          {/* Progress Tracker */}
          <ProgressTracker currentStep={3} totalSteps={3} />

          {/* Form Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-800">
              Tell us about your organisation
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Annual Operating Budget */}
            <div className="space-y-4">
              <label className="text-lg font-medium text-gray-700">
                Annual Operating Budget{" "}
                <span className="text-sm text-gray-500">
                  (*Cost spending by the enterprise or latest FY)
                </span>
              </label>
              <div className="space-y-1">
                <Input
                  {...register("annualBudget")}
                  placeholder="Enter annual budget in INR"
                  type="text"
                  className={cn(
                    "w-full h-12 px-4 py-3 rounded-lg bg-white focus:outline-none focus:ring-0 focus:border-transparent transition-colors",
                    errors.annualBudget ? "border-red-500" : "gradient-border"
                  )}
                />
                {errors.annualBudget && (
                  <p className="text-red-500 text-sm">{errors.annualBudget.message}</p>
                )}
              </div>
            </div>

            {/* Funding Source */}
            <div className="space-y-4">
              <label className="text-lg font-medium text-gray-700">
                What are you using the questionnaire for funding or self assessment?
              </label>
              <RadioGroup
                value={selectedFundingSource}
                onValueChange={(value) => setValue("fundingSource", value as any)}
                className="flex flex-wrap gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="funding" id="funding" />
                  <label htmlFor="funding" className="text-sm cursor-pointer">
                    Funding
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="self-assessment" id="self-assessment" />
                  <label htmlFor="self-assessment" className="text-sm cursor-pointer">
                    Self assessment
                  </label>
                </div>
              </RadioGroup>
              {errors.fundingSource && (
                <p className="text-red-500 text-sm">{errors.fundingSource.message}</p>
              )}
            </div>

            {/* Philanthropic Funding */}
            <div className="space-y-4">
              <label className="text-lg font-medium text-gray-700">
                Have you receive philanthropic funding before?
              </label>
              <RadioGroup
                value={selectedPhilanthropicFunding}
                onValueChange={(value) => setValue("philanthropicFunding", value as any)}
                className="flex flex-wrap gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="yes" />
                  <label htmlFor="yes" className="text-sm cursor-pointer">
                    Yes
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="no" />
                  <label htmlFor="no" className="text-sm cursor-pointer">
                    No
                  </label>
                </div>
              </RadioGroup>
              {errors.philanthropicFunding && (
                <p className="text-red-500 text-sm">{errors.philanthropicFunding.message}</p>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-center pt-6">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full max-w-xs h-12 text-white font-medium rounded-lg gradient-bg hover:opacity-90 transition-opacity"
              >
                {isSubmitting ? "Completing..." : "Start the Assessment"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignupStep5
