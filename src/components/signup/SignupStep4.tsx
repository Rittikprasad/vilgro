import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useDispatch, useSelector } from "react-redux"
import { Button } from "../ui/Button"
import { RadioGroup, RadioGroupItem } from "../ui/RadioGroup"
import { cn } from "../../lib/utils"
import logo from "../../assets/logo.png"
import ProgressTracker from "../ui/ProgressTracker"
import Navbar from "../ui/Navbar"
import { fetchMetaOptions } from "../../features/meta/metaSlice"
import type { RootState } from "../../app/store"

// Validation schema for Step 4
const step4Schema = z.object({
  focusSector: z.string().min(1, "Please select your main focus sector"),
  stage: z.string().min(1, "Please select your current stage"),
  impactFocus: z.string().min(1, "Please select your impact focus")
})

type Step4FormData = z.infer<typeof step4Schema>

interface SignupStep4Props {
  onNext: (data: Step4FormData) => void
  onBack: () => void
}

/**
 * Signup Step 4 Component - Focus sector and impact selection
 * Allows users to select their main focus sector and impact type
 */
const SignupStep4: React.FC<SignupStep4Props> = ({ onNext, onBack }) => {
  const dispatch = useDispatch()
  const { options, isLoading: metaLoading } = useSelector((state: RootState) => state.meta)

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Step4FormData>({
    resolver: zodResolver(step4Schema),
  })

  const selectedFocusSector = watch("focusSector")
  const selectedStage = watch("stage")
  const selectedImpactFocus = watch("impactFocus")

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
  const onSubmit = async (data: Step4FormData) => {
    try {
      console.log("Step 4 submitted:", data)
      onNext(data)
    } catch (error) {
      console.error("Step 4 error:", error)
    }
  }

  // Icon mapping for focus sectors
  const sectorIcons: Record<string, string> = {
    AGRICULTURE: "🌾",
    WASTE: "♻️",
    HEALTH: "🏥",
    LIVELIHOOD: "💼",
    OTHERS: "📚"
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Top Navbar */}
      <Navbar />

      {/* Left Content Section */}
      <div className="flex-1 pt-4">
        {/* Main Content */}
        <div className="flex items-start justify-start min-h-screen px-6 py-8 pt-24">
          <div className="w-full max-w-4xl ml-8">
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
              {/* Focus Sector Selection */}
              <div className="space-y-4">
                <label className="block text-lg font-medium text-gray-700 mb-4">
                  Which is your main focus sector?
                </label>
                {metaLoading ? (
                  <div className="text-sm text-gray-500">Loading focus sectors...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2">
                    {options?.focus_sectors?.map((sector) => (
                      <div
                        key={sector.key}
                        className={cn(
                          "relative cursor-pointer rounded-lg border-2 p-2 text-center transition-all hover:shadow-md",
                          selectedFocusSector === sector.key
                            ? "border-[#46B753] bg-green-50"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        )}
                        onClick={() => setValue("focusSector", sector.key)}
                      >
                        <div className="text-4xl mb-3">{sectorIcons[sector.key] || "📚"}</div>
                        <p className="text-sm font-medium text-gray-900 mb-2">
                          {sector.label}
                        </p>

                        {selectedFocusSector === sector.key && (
                          <div className="absolute top-2 right-2 w-4 h-4 bg-[#46B753] rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {errors.focusSector && (
                  <p className="text-red-500 text-sm">{errors.focusSector.message}</p>
                )}
              </div>

              {/* Stage Selection */}
              <div className="space-y-3">
                <label className="block text-lg font-medium text-gray-700 mb-3">
                  At what stage you are?
                </label>
                {metaLoading ? (
                  <div className="text-sm text-gray-500">Loading stages...</div>
                ) : (
                  <RadioGroup
                    value={selectedStage}
                    onValueChange={(value) => setValue("stage", value)}
                    className="flex flex-wrap gap-6"
                  >
                    {options?.stages?.map((stage) => (
                      <div key={stage.key} className="flex items-center space-x-2">
                        <RadioGroupItem value={stage.key} id={stage.key} />
                        <label htmlFor={stage.key} className="text-sm cursor-pointer">
                          {stage.label}
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
                {errors.stage && (
                  <p className="text-red-500 text-sm">{errors.stage.message}</p>
                )}
              </div>

              {/* Impact Focus */}
              <div className="space-y-3">
                <label className="block text-lg font-medium text-gray-700 mb-3">
                  What kind of impact you focus on creating?
                </label>
                {metaLoading ? (
                  <div className="text-sm text-gray-500">Loading impact focus options...</div>
                ) : (
                  <RadioGroup
                    value={selectedImpactFocus}
                    onValueChange={(value) => setValue("impactFocus", value)}
                    className="flex flex-wrap gap-6"
                  >
                    {options?.impact_focus?.map((impact) => (
                      <div key={impact.key} className="flex items-center space-x-2">
                        <RadioGroupItem value={impact.key} id={impact.key} />
                        <label htmlFor={impact.key} className="text-sm cursor-pointer">
                          {impact.label}
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
                {errors.impactFocus && (
                  <p className="text-red-500 text-sm">{errors.impactFocus.message}</p>
                )}
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

export default SignupStep4
