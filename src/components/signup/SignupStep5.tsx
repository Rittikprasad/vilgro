import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useDispatch, useSelector } from "react-redux"
import { Input } from "../ui/Input"
import { Button } from "../ui/Button"
import { RadioGroup, RadioGroupItem } from "../ui/RadioGroup"
import { cn } from "../../lib/utils"
import logo from "../../assets/logo.png"
import ProgressTracker from "../ui/ProgressTracker"
import Navbar from "../ui/Navbar"
import { fetchMetaOptions } from "../../features/meta/metaSlice"
import type { RootState } from "../../app/store"

// Validation schema for Step 5
const step5Schema = z.object({
  annualBudget: z.string().min(1, "Annual operating budget is required"),
  org_desc: z.string().optional(),
  fundingSource: z.string().min(1, "Please select funding source"),
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
const SignupStep5: React.FC<SignupStep5Props> = ({ onComplete, onBack: _onBack }) => {
  const dispatch = useDispatch()
  const { options, isLoading: metaLoading } = useSelector((state: RootState) => state.meta)

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
  const annualBudgetValue = watch("annualBudget") || ""

  // Formats numeric string into Indian numbering system (e.g., 345000 -> 3,45,000).
  const formatIndianNumber = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "")
    if (!digitsOnly) return ""

    const lastThree = digitsOnly.slice(-3)
    const remaining = digitsOnly.slice(0, -3)

    if (!remaining) return lastThree

    const grouped = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ",")
    return `${grouped},${lastThree}`
  }

  const handleAnnualBudgetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatIndianNumber(event.target.value)
    setValue("annualBudget", formattedValue, { shouldValidate: true })
  }

  // Fetch meta options on component mount
  useEffect(() => {
    if (!options) {
      dispatch(fetchMetaOptions() as any)
    }
  }, [dispatch, options])

  /**
   * Handle form submission
   * @param data - Form data validated by Zod schema
   */
  const onSubmit = async (data: Step5FormData) => {
    try {
      const sanitizedData: Step5FormData = {
        ...data,
        annualBudget: data.annualBudget.replace(/,/g, ""),
      }
      onComplete(sanitizedData)
    } catch (error) {
      console.error("Step 5 error:", error)
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Top Navbar */}
      <Navbar />

      {/* Left Content Section */}
      <div className="flex-1 pt-4">
        {/* Main Content */}
        <div className="flex items-start justify-start min-h-screen px-6 py-8 pt-24">
          <div className="w-full max-w-2xl ml-8">
            {/* Form Title */}
            <div className="mb-8">
              <h1 className="text-[25px] font-[400] text-gray-800 font-[Baskervville]" >
                Tell us about your organisation
              </h1>
            </div>

            {/* Progress Tracker */}
            <ProgressTracker currentStep={3} totalSteps={3} />

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Annual Operating Budget */}
              <div className="space-y-3 pb-6 border-b border-gray-200">
                <label className="block text-[15px] font-[500] text-gray-900 font-golos mb-3">
                  Annual Operating Budget<span className="text-red-500">*</span>
                  <span className="text-[13px] font-[300] font-golos text-gray-500">
                    (Total spending by the enterprise in latest FY)
                  </span>
                </label>
                <div className="space-y-1">
                  <Input
                    {...register("annualBudget")}
                    value={annualBudgetValue}
                    onChange={handleAnnualBudgetChange}
                    placeholder="Enter here (₹)"
                    type="text"
                    className={cn(
                      "w-full h-11 px-4 py-3 rounded-lg bg-white focus:outline-none focus:ring-0 focus:border-transparent transition-colors",
                      errors.annualBudget ? "border-red-500" : "gradient-border"
                    )}
                  />
                  {errors.annualBudget && (
                    <p className="text-red-500 text-sm">{errors.annualBudget.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-[15px] font-[500] text-gray-900 font-golos mb-3">
                  Tell us about your company
                </label>
                <div className="space-y-1">
                  <Input
                    {...register("org_desc")}
                    placeholder="Type here"
                    type="text"
                    className="w-full border-0 border-b border-gray-300 bg-transparent px-0 py-2 focus:outline-none focus:border-gray-500 transition-colors"
                  />
                </div>
              </div>

              {/* Funding Source */}
              <div className="space-y-3 pb-6 border-b border-gray-200">
                <label className="block text-[15px] font-[500] text-gray-900 font-golos mb-3">
                  What are you using the questionnaire for funding or self assessment?
                </label>
                {metaLoading ? (
                  <div className="text-sm text-gray-500">Loading questionnaire options...</div>
                ) : (
                  <RadioGroup
                    value={selectedFundingSource}
                    onValueChange={(value) => setValue("fundingSource", value)}
                    className="flex flex-wrap gap-6"
                  >
                    {options?.use_of_questionnaire?.map((option) => (
                      <div key={option.key} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.key} id={option.key} />
                        <label htmlFor={option.key} className="text-[13px] font-[300] font-golos cursor-pointer">
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
                {errors.fundingSource && (
                  <p className="text-red-500 text-sm">{errors.fundingSource.message}</p>
                )}
              </div>

              {/* Philanthropic Funding */}
              <div className="space-y-3">
                <label className="block text-[15px] font-[500] text-gray-900 font-golos mb-3">
                  Have you receive philanthropic funding before?
                </label>
                <RadioGroup
                  value={selectedPhilanthropicFunding}
                  onValueChange={(value) => setValue("philanthropicFunding", value as any)}
                  className="flex flex-wrap gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="yes" />
                    <label htmlFor="yes" className="text-[13px] font-[300] font-golos cursor-pointer">
                      Yes
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="no" />
                    <label htmlFor="no" className="text-[13px] font-[300] font-golos cursor-pointer">
                      No
                    </label>
                  </div>
                </RadioGroup>
                {errors.philanthropicFunding && (
                  <p className="text-red-500 text-sm">{errors.philanthropicFunding.message}</p>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-start pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full max-w-xs h-12 text-black font-medium rounded-lg gradient-bg hover:opacity-90 transition-opacity"
                >
                  {isSubmitting ? "Completing..." : "Start the Assessment"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Right Side - White background */}
      <div className="flex-1 relative hidden lg:block bg-white">
        {/* Logo positioned in top right corner */}
      </div>

      {/* Mobile Background - Optional */}
      <div className="lg:hidden h-64 w-full relative bg-white">
        <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent"></div>

        {/* Logo positioned in top right corner for mobile */}
        <div className="absolute top-4 right-4 z-20">
          <img src={logo} alt="logo" className="object-contain w-24" />
        </div>
      </div>
    </div>
  )
}

export default SignupStep5
