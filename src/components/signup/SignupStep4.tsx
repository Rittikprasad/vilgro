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
import AgricultureIcon from '../../assets/Agriculture.svg'
import RecyclingIcon from '../../assets/Recycling.svg'
import HealthcareIcon from '../../assets/Healthcare.svg'
import EnvelopeIcon from '../../assets/Envelope.svg'
import OthersIcon from '../../assets/others.svg'
import { Input } from "../ui/Input"

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
    AGRICULTURE: AgricultureIcon,
    WASTE: RecyclingIcon,
    HEALTH: HealthcareIcon,
    LIVELIHOOD: EnvelopeIcon,
    OTHERS: OthersIcon
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
              <h1 className="text-[25px] font-[400] text-gray-800 font-[Baskervville]">
                Tell us about your organisation
              </h1>
            </div>

            {/* Progress Tracker */}
            <ProgressTracker currentStep={2} totalSteps={3} />

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
              {/* Focus Sector Selection */}
              <div className="space-y-4 pb-6 border-b border-gray-200">
                <label className="block text-[15px] font-[500] text-gray-900 font-golos mb-4">
                  Which is your main focus sector?<span className="text-red-500">*</span>
                </label>
                {metaLoading ? (
                  <div className="text-sm text-gray-500">Loading focus sectors...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {options?.focus_sectors?.map((sector) => {
                      const isSelected = selectedFocusSector === sector.key
                      const hasSelection = selectedFocusSector !== undefined
                      
                      return (
                      <div
                        key={sector.key}
                        className={cn(
                          "relative cursor-pointer rounded-lg border-2 p-2 text-center transition-all flex flex-col items-center justify-center",
                          !hasSelection || isSelected ? "sector-card-gradient-border" : "",
                          isSelected ? "bg-green-50" : "bg-white",
                          hasSelection && !isSelected && "border-white"
                        )}
                        style={
                          hasSelection && !isSelected
                            ? {
                                boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
                              }
                            : undefined
                        }
                        onClick={() => setValue("focusSector", sector.key)}
                      >
                        <div className="text-4xl mb-3 flex items-center justify-center">
                          <img src={sectorIcons[sector.key]} alt={sector.label} className="w-10 h-10" />
                        </div>
                        <p className="text-[13px] font-[300] font-golos text-gray-900">
                          {sector.label}
                        </p>
                      </div>
                      )
                    })}
                  </div>
                )}
                {errors.focusSector && (
                  <p className="text-red-500 text-sm">{errors.focusSector.message}</p>
                )}
              </div>

              {/* Stage Selection */}
              <div className="space-y-3 pb-6 border-b border-gray-200">
                <label className="block text-[15px] font-[500] text-gray-900 font-golos mb-3">
                  At what stage you are?<span className="text-red-500">*</span>
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
                        <label htmlFor={stage.key} className="text-[13px] font-[300] font-golos cursor-pointer">
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
              <div className="space-y-3 pb-6 border-b border-gray-200">
                <label className="block text-[15px] font-[500] text-gray-900 font-golos mb-3">
                  What kind of impact you focus on creating?<span className="text-red-500">*</span>
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
                        <label htmlFor={impact.key} className="text-[13px] font-[300] font-golos cursor-pointer">
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
              <div>
                   <Input
                     placeholder="Give some information"
                     type="text"
                     className="w-full border-0 border-b border-gray-300 bg-transparent px-0 py-2 focus:outline-none focus:border-gray-500 transition-colors"
                   />
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

export default SignupStep4
