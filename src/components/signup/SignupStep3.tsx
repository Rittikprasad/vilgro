import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useDispatch, useSelector } from "react-redux"
import { Button } from "../ui/Button"
import { RadioGroup, RadioGroupItem } from "../ui/RadioGroup"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/Select"
import { cn } from "../../lib/utils"
import logo from "../../assets/logo.png"
import ProgressTracker from "../ui/ProgressTracker"
import Navbar from "../ui/Navbar"
import { fetchMetaOptions } from "../../features/meta/metaSlice"
import type { RootState } from "../../app/store"

// Validation schema for Step 3
const step3Schema = z.object({
  innovationType: z.string().min(1, "Please select an innovation type"),
  geographicScope: z.string().min(1, "Please select geographic scope"),
  state1: z.string().min(1, "Please select first state"),
  state2: z.string().min(1, "Please select second state"),
  state3: z.string().min(1, "Please select third state"),
  state4: z.string().min(1, "Please select fourth state"),
  state5: z.string().min(1, "Please select fifth state"),
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
  const dispatch = useDispatch()
  const { options, isLoading: metaLoading } = useSelector((state: RootState) => state.meta)

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Step3FormData>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      innovationType: "",
      geographicScope: "",
      state1: "",
      state2: "",
      state3: "",
      state4: "",
      state5: "",
    },
  })

  const selectedInnovationType = watch("innovationType")
  const selectedGeographicScope = watch("geographicScope")
  const selectedState1 = watch("state1")
  const selectedState2 = watch("state2")
  const selectedState3 = watch("state3")
  const selectedState4 = watch("state4")
  const selectedState5 = watch("state5")

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
      {/* Top Navbar */}
      <Navbar />

      {/* Left Content Section */}
      <div className="flex-1 pt-4">
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
                <label className="block text-md font-medium text-gray-700 mb-3">
                  Type of Innovation <span>*</span>
                </label>
                {metaLoading ? (
                  <div className="text-sm text-gray-500">Loading innovation types...</div>
                ) : (
                  <RadioGroup
                    value={selectedInnovationType}
                    onValueChange={(value) => setValue("innovationType", value)}
                    className="flex flex-wrap gap-6"
                  >
                    {options?.innovation_types?.map((type) => (
                      <div key={type.key} className="flex items-center space-x-2">
                        <RadioGroupItem value={type.key} id={type.key} />
                        <label htmlFor={type.key} className="text-sm cursor-pointer">
                          {type.label}
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
                {errors.innovationType && (
                  <p className="text-red-500 text-sm">{errors.innovationType.message}</p>
                )}
              </div>

              {/* Geographic Scope of work */}
              <div className="space-y-3">
                <label className="block text-md font-medium text-gray-700 mb-3">
                  Geographic Scope of work <span>*</span>
                </label>
                {metaLoading ? (
                  <div className="text-sm text-gray-500">Loading geographic scopes...</div>
                ) : (
                  <RadioGroup
                    value={selectedGeographicScope}
                    onValueChange={(value) => setValue("geographicScope", value)}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    {options?.geo_scopes?.map((scope) => (
                      <div key={scope.key} className="flex items-center space-x-2">
                        <RadioGroupItem value={scope.key} id={scope.key} />
                        <label htmlFor={scope.key} className="text-sm cursor-pointer">
                          {scope.label}
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
                {errors.geographicScope && (
                  <p className="text-red-500 text-sm">{errors.geographicScope.message}</p>
                )}
              </div>

              {/* State Selection */}
              <div className="space-y-3">
                <label className="block text-md font-medium text-gray-700 mb-3">
                  Select top 5 states based on customer presence <span>*</span>
                </label>
                {metaLoading ? (
                  <div className="text-sm text-gray-500">Loading states...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { num: 1, value: selectedState1 },
                      { num: 2, value: selectedState2 },
                      { num: 3, value: selectedState3 },
                      { num: 4, value: selectedState4 },
                      { num: 5, value: selectedState5 },
                    ].map(({ num, value }) => (
                      <div key={num} className="space-y-1">
                        <Select 
                          value={value} 
                          onValueChange={(newValue) => setValue(`state${num}` as any, newValue)}
                        >
                          <SelectTrigger className={cn(
                            "w-full h-12 rounded-lg bg-white",
                            errors[`state${num}` as keyof Step3FormData] ? "border-red-500" : "gradient-border"
                          )}>
                            <SelectValue placeholder={`Select State ${num}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {options?.states?.map((state) => (
                              <SelectItem key={state} value={state}>
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
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-start pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full max-w-xs h-12 text-black font-medium rounded-lg gradient-bg hover:opacity-90 transition-opacity"
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
