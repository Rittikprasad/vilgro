import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Input } from "../ui/Input"
import { Button } from "../ui/Button"
import { RadioGroup, RadioGroupItem } from "../ui/RadioGroup"
import { cn } from "../../lib/utils"
import logo from "../../assets/logo.png"
import background1 from "../../assets/background1.jpg"
import ProgressTracker from "../ui/ProgressTracker"

// Validation schema for Step 2
const step2Schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  designation: z.string().min(1, "Designation is required"),
  companyName: z.string().min(1, "Company name is required"),
  legalRegistrationType: z.enum(["private-limited", "public-limited", "partnership", "sole-proprietorship"]).refine((val) => val !== undefined, {
    message: "Please select a legal registration type"
  })
})

type Step2FormData = z.infer<typeof step2Schema>

interface SignupStep2Props {
  onNext: (data: Step2FormData) => void
  onBack: () => void
}

/**
 * Signup Step 2 Component - Tell us about yourself
 * Collects personal and company information
 */
const SignupStep2: React.FC<SignupStep2Props> = ({ onNext, onBack }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Step2FormData>({
    resolver: zodResolver(step2Schema),
  })

  const selectedRegistrationType = watch("legalRegistrationType")

  /**
   * Handle form submission
   * @param data - Form data validated by Zod schema
   */
  const onSubmit = async (data: Step2FormData) => {
    try {
      console.log("Step 2 submitted:", data)
      onNext(data)
    } catch (error) {
      console.error("Step 2 error:", error)
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative">
      {/* White gradient overlay in the middle */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent z-10 hidden lg:block"></div>

      {/* Left Content Section */}
      <div className="flex-1 relative">
        {/* Main Content */}
        <div className="flex items-start justify-center min-h-screen px-6 py-8 pt-24 relative z-20">
          <div className="w-full max-w-2xl">
            {/* Form Title */}
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-gray-800">
                Tell us about yourself
              </h1>
            </div>

            {/* Progress Tracker */}
            <ProgressTracker currentStep={1} totalSteps={3} />



            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Fields Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Input
                    {...register("firstName")}
                    placeholder="First Name"
                    className={cn(
                      "w-full h-12 px-4 py-3 rounded-lg bg-white focus:outline-none focus:ring-0 focus:border-transparent transition-colors",
                      errors.firstName ? "border-red-500" : "gradient-border"
                    )}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm">{errors.firstName.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Input
                    {...register("lastName")}
                    placeholder="Last Name"
                    className={cn(
                      "w-full h-12 px-4 py-3 rounded-lg bg-white focus:outline-none focus:ring-0 focus:border-transparent transition-colors",
                      errors.lastName ? "border-red-500" : "gradient-border"
                    )}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              {/* Phone and Designation Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Input
                    {...register("phoneNumber")}
                    placeholder="Phone Number"
                    type="tel"
                    className={cn(
                      "w-full h-12 px-4 py-3 rounded-lg bg-white focus:outline-none focus:ring-0 focus:border-transparent transition-colors",
                      errors.phoneNumber ? "border-red-500" : "gradient-border"
                    )}
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Input
                    {...register("designation")}
                    placeholder="Your Designation"
                    className={cn(
                      "w-full h-12 px-4 py-3 rounded-lg bg-white focus:outline-none focus:ring-0 focus:border-transparent transition-colors",
                      errors.designation ? "border-red-500" : "gradient-border"
                    )}
                  />
                  {errors.designation && (
                    <p className="text-red-500 text-sm">{errors.designation.message}</p>
                  )}
                </div>
              </div>

              {/* Company Name */}
              <div className="space-y-1">
                <Input
                  {...register("companyName")}
                  placeholder="Company Name"
                  className={cn(
                    "w-full h-12 px-4 py-3 rounded-lg bg-white focus:outline-none focus:ring-0 focus:border-transparent transition-colors",
                    errors.companyName ? "border-red-500" : "gradient-border"
                  )}
                />
                {errors.companyName && (
                  <p className="text-red-500 text-sm">{errors.companyName.message}</p>
                )}
              </div>

              {/* Legal Registration Type */}
              <div className="space-y-4">
                <label className="text-sm font-medium text-gray-700 ">
                  Legal Registration Type
                </label>
                <RadioGroup
                  value={selectedRegistrationType}
                  onValueChange={(value) => setValue("legalRegistrationType", value as any)}
                  className="grid grid-cols-2 gap-4 pt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="private-limited" id="private-limited" />
                    <label htmlFor="private-limited" className="text-sm cursor-pointer">
                      Private Limited Company
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="public-limited" id="public-limited" />
                    <label htmlFor="public-limited" className="text-sm cursor-pointer">
                      Public Limited Company
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="partnership" id="partnership" />
                    <label htmlFor="partnership" className="text-sm cursor-pointer">
                      Partnership Firm
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sole-proprietorship" id="sole-proprietorship" />
                    <label htmlFor="sole-proprietorship" className="text-sm cursor-pointer">
                      Sole Proprietorship
                    </label>
                  </div>
                </RadioGroup>
                {errors.legalRegistrationType && (
                  <p className="text-red-500 text-sm">{errors.legalRegistrationType.message}</p>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-start pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full max-w-xs h-12 text-white font-medium rounded-lg gradient-bg hover:opacity-90 transition-opacity"
                >
                  {isSubmitting ? "Processing..." : "Next Account"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="flex-1 relative hidden lg:block">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${background1})` }}
        />

        {/* White gradient overlay extending from left */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/20 to-transparent z-10"></div>

        {/* Logo positioned in top right corner over the image */}
        <div className="absolute top-6 right-6 z-20">
          <img src={logo} alt="logo" className="object-contain w-30" />
        </div>

        <div className="relative z-10 h-full flex items-center justify-center">

        </div>
      </div>

      {/* Mobile Background Image - Optional */}
      <div className="lg:hidden h-64 w-full relative">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${background1})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent"></div>

        {/* Logo positioned in top right corner for mobile */}
        <div className="absolute top-4 right-4 z-20">
          <img src={logo} alt="logo" className="object-contain w-24" />
        </div>
      </div>
    </div>
  )
}

export default SignupStep2
