import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "../ui/Button"
import { RadioGroup, RadioGroupItem } from "../ui/RadioGroup"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/Select"
import { cn } from "../../lib/utils"
import logo from "../../assets/logo.png"
import ProgressTracker from "../ui/ProgressTracker"

// Validation schema for Step 3
const step3Schema = z.object({
  innovationType: z.enum(["product-based", "process-based", "service-based"]).refine((val) => val !== undefined, {
    message: "Please select an innovation type"
  }),
  geographicScope: z.enum(["specific-locality", "across-one-more-districts", "across-one-more-states", "pan-india"]).refine((val) => val !== undefined, {
    message: "Please select geographic scope"
  }),
  state1: z.string().min(1, "Please select first state"),
  state2: z.string().optional(),
  state3: z.string().optional(),
  state4: z.string().optional(),
  state5: z.string().optional(),
})

type Step3FormData = z.infer<typeof step3Schema>

interface SignupStep3Props {
  onNext: (data: Step3FormData) => void
  onBack: () => void
}

/**
 * Signup Step 3 Component - Tell us about your organisation
 * Collects innovation type and geographic scope information
 */
const SignupStep3: React.FC<SignupStep3Props> = ({ onNext, onBack }) => {
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Step3FormData>({
    resolver: zodResolver(step3Schema),
  })

  const selectedInnovationType = watch("innovationType")
  const selectedGeographicScope = watch("geographicScope")

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ]

  /**
   * Handle form submission
   * @param data - Form data validated by Zod schema
   */
  const onSubmit = async (data: Step3FormData) => {
    try {
      console.log("Step 3 submitted:", data)
      onNext(data)
    } catch (error) {
      console.error("Step 3 error:", error)
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Content Section */}
      <div className="flex-1">
        {/* Main Content */}
        <div className="flex items-start justify-start min-h-screen px-6 py-8 pt-24">
          <div className="w-full max-w-2xl ml-8">
            {/* Form Title */}
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-gray-800">
                Tell us about your organisation
              </h1>
            </div>

            {/* Progress Tracker */}
            <ProgressTracker currentStep={2} totalSteps={3} />

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Type of Innovation */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Type of Innovation
                </label>
                <RadioGroup
                  value={selectedInnovationType}
                  onValueChange={(value) => setValue("innovationType", value as any)}
                  className="flex flex-wrap gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="product-based" id="product-based" />
                    <label htmlFor="product-based" className="text-sm cursor-pointer">
                      Product-based
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="process-based" id="process-based" />
                    <label htmlFor="process-based" className="text-sm cursor-pointer">
                      Process-based
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="service-based" id="service-based" />
                    <label htmlFor="service-based" className="text-sm cursor-pointer">
                      Service-based
                    </label>
                  </div>
                </RadioGroup>
                {errors.innovationType && (
                  <p className="text-red-500 text-sm">{errors.innovationType.message}</p>
                )}
              </div>

              {/* Geographic Scope of work */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Geographic Scope of work
                </label>
                <RadioGroup
                  value={selectedGeographicScope}
                  onValueChange={(value) => setValue("geographicScope", value as any)}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="specific-locality" id="specific-locality" />
                    <label htmlFor="specific-locality" className="text-sm cursor-pointer">
                      A specific locality
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="across-one-more-districts" id="across-one-more-districts" />
                    <label htmlFor="across-one-more-districts" className="text-sm cursor-pointer">
                      Across one or more districts
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="across-one-more-states" id="across-one-more-states" />
                    <label htmlFor="across-one-more-states" className="text-sm cursor-pointer">
                      Across one or more states
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pan-india" id="pan-india" />
                    <label htmlFor="pan-india" className="text-sm cursor-pointer">
                      PAN India
                    </label>
                  </div>
                </RadioGroup>
                {errors.geographicScope && (
                  <p className="text-red-500 text-sm">{errors.geographicScope.message}</p>
                )}
              </div>

              {/* State Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select top 5 states based on customer presence
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <div key={num} className="space-y-1">
                      <Select onValueChange={(value) => setValue(`state${num}` as any, value)}>
                        <SelectTrigger className={cn(
                          "w-full h-12 rounded-lg bg-white",
                          errors[`state${num}` as keyof Step3FormData] ? "border-red-500" : "gradient-border"
                        )}>
                          <SelectValue placeholder={`Select State ${num}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {indianStates.map((state) => (
                            <SelectItem key={state} value={state.toLowerCase().replace(/\s+/g, '-')}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors[`state${num}` as keyof Step3FormData] && (
                        <p className="text-red-500 text-sm">
                          {errors[`state${num}` as keyof Step3FormData]?.message}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-start pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full max-w-xs h-12 text-white font-medium rounded-lg gradient-bg hover:opacity-90 transition-opacity"
                >
                  {isSubmitting ? "Processing..." : "Next"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Right Side - White background */}
      <div className="flex-1 relative hidden lg:block bg-white">
        {/* Logo positioned in top right corner */}
        <div className="absolute top-6 right-6 z-20">
          <img src={logo} alt="logo" className="object-contain w-30" />
        </div>
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

export default SignupStep3
