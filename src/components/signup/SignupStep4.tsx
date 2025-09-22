import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "../ui/Button"
import { RadioGroup, RadioGroupItem } from "../ui/RadioGroup"
import { cn } from "../../lib/utils"
import logo from "../../assets/logo.png"
import ProgressTracker from "../ui/ProgressTracker"

// Validation schema for Step 4
const step4Schema = z.object({
  focusSector: z.enum(["agriculture", "supply-chain-management", "healthcare", "livelihoods", "education"]).refine((val) => val !== undefined, {
    message: "Please select your main focus sector"
  }),
  stage: z.enum(["prototype", "product-ready", "pre-revenue", "early-revenue", "growing-scaling"]).refine((val) => val !== undefined, {
    message: "Please select your current stage"
  }),
  impactFocus: z.enum(["social-impact", "environmental-impact", "both"]).refine((val) => val !== undefined, {
    message: "Please select your impact focus"
  })
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

  const focusSectors = [
    {
      id: "agriculture",
      name: "Agriculture",
      icon: "🌾",
      description: "Farming & AgTech solutions"
    },
    {
      id: "supply-chain-management",
      name: "Supply Chain Management",
      icon: "🚛",
      description: "Logistics & distribution"
    },
    {
      id: "healthcare",
      name: "Healthcare",
      icon: "🏥",
      description: "Medical & wellness solutions"
    },
    {
      id: "livelihoods",
      name: "Livelihoods",
      icon: "💼",
      description: "Employment & income generation"
    },
    {
      id: "education",
      name: "Education",
      icon: "📚",
      description: "Learning & skill development"
    }
  ]

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Content Section */}
      <div className="flex-1">
        {/* Main Content */}
        <div className="flex items-start justify-center min-h-screen px-6 py-8 pt-24">
          <div className="w-full max-w-4xl">
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
              <div className="space-y-6">
                <label className="text-lg font-medium text-gray-700">
                  Which is your main focus sector?
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {focusSectors.map((sector) => (
                    <div
                      key={sector.id}
                      className={cn(
                        "relative cursor-pointer rounded-lg border-2 p-6 text-center transition-all hover:shadow-md",
                        selectedFocusSector === sector.id
                          ? "border-[#46B753] bg-green-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      )}
                      onClick={() => setValue("focusSector", sector.id as any)}
                    >
                      <div className="text-4xl mb-3">{sector.icon}</div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2">
                        {sector.name}
                      </h3>
                      <p className="text-xs text-gray-500">{sector.description}</p>

                      {selectedFocusSector === sector.id && (
                        <div className="absolute top-2 right-2 w-4 h-4 bg-[#46B753] rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {errors.focusSector && (
                  <p className="text-red-500 text-sm">{errors.focusSector.message}</p>
                )}
              </div>

              {/* Stage Selection */}
              <div className="space-y-4">
                <label className="text-lg font-medium text-gray-700">
                  At what stage you are?
                </label>
                <RadioGroup
                  value={selectedStage}
                  onValueChange={(value) => setValue("stage", value as any)}
                  className="flex flex-wrap gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="prototype" id="prototype" />
                    <label htmlFor="prototype" className="text-sm cursor-pointer">
                      Prototype
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="product-ready" id="product-ready" />
                    <label htmlFor="product-ready" className="text-sm cursor-pointer">
                      Product ready - pre revenue
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="early-revenue" id="early-revenue" />
                    <label htmlFor="early-revenue" className="text-sm cursor-pointer">
                      Early revenue
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="growing-scaling" id="growing-scaling" />
                    <label htmlFor="growing-scaling" className="text-sm cursor-pointer">
                      Growing and scaling
                    </label>
                  </div>
                </RadioGroup>
                {errors.stage && (
                  <p className="text-red-500 text-sm">{errors.stage.message}</p>
                )}
              </div>

              {/* Impact Focus */}
              <div className="space-y-4">
                <label className="text-lg font-medium text-gray-700">
                  What kind of impact you focus on creating?
                </label>
                <RadioGroup
                  value={selectedImpactFocus}
                  onValueChange={(value) => setValue("impactFocus", value as any)}
                  className="flex flex-wrap gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="social-impact" id="social-impact" />
                    <label htmlFor="social-impact" className="text-sm cursor-pointer">
                      Social Impact
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="environmental-impact" id="environmental-impact" />
                    <label htmlFor="environmental-impact" className="text-sm cursor-pointer">
                      Environmental Impact
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="both" id="both" />
                    <label htmlFor="both" className="text-sm cursor-pointer">
                      Both
                    </label>
                  </div>
                </RadioGroup>
                {errors.impactFocus && (
                  <p className="text-red-500 text-sm">{errors.impactFocus.message}</p>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-center pt-6">
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
