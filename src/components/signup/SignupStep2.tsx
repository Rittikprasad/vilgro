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
import background1 from "../../assets/background1.jpg"
import ProgressTracker from "../ui/ProgressTracker"
import Navbar from "../ui/Navbar"
import { fetchMetaOptions } from "../../features/meta/metaSlice"
import { completeSignup, clearError } from "../../features/signup/signupSlice"
import type { RootState } from "../../app/store"
import { phoneRegex, formatPhoneNumber } from "../../lib/validations"

// Validation schema for Step 2
const step2Schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phoneNumber: z
    .string()
    .optional()
    .refine(
      (val) => !val || phoneRegex.test(val),
      "Phone number must be in format +91 followed by 10 digits (e.g., +91XXXXXXXXXX)"
    ),
  designation: z.string().email("Please enter a valid email address"),
  companyName: z.string().min(1, "Company name is required"),
  legalRegistrationType: z.string().optional(), // Made optional
  dateOfIncorporation: z.string().min(1, "Date of Incorporation is required"), // Made mandatory
  gstNumber: z.string().optional(), // Made optional
  cinNumber: z.string().min(1, "CIN Number is required"), // Made mandatory
})

type Step2FormData = z.infer<typeof step2Schema>

interface SignupStep2Props {
  onNext: (data: Step2FormData) => void
  onBack?: () => void
}

/**
 * Signup Step 2 Component - Tell us about yourself
 * Collects personal and company information
 */
const SignupStep2: React.FC<SignupStep2Props> = ({ onNext }) => {
  const dispatch = useDispatch()
  const { options, isLoading: metaLoading } = useSelector((state: RootState) => state.meta)
  const { isLoading: signupLoading, error: signupError } = useSelector((state: RootState) => state.signup)
  const { accessToken, isAuthenticated, user } = useSelector((state: RootState) => state.auth)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Step2FormData>({
    resolver: zodResolver(step2Schema),
  })

  const selectedRegistrationType = watch("legalRegistrationType")
  
  // Format phone number handler
  const phoneNumberRegister = register("phoneNumber")
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Use the reusable formatPhoneNumber utility
    const formattedValue = formatPhoneNumber(e.target.value);
    
    // Update the input value and form state
    e.target.value = formattedValue;
    setValue("phoneNumber", formattedValue, { shouldValidate: true });
  }

  // Fetch meta options on component mount
  useEffect(() => {
    if (!options) {
      dispatch(fetchMetaOptions() as any)
    }
  }, [dispatch, options])

  // Clear signup error when component mounts
  useEffect(() => {
    if (signupError) {
      dispatch(clearError())
    }
  }, [dispatch, signupError])

  // Pre-fill email from user data
  useEffect(() => {
    if (user?.email) {
      setValue("designation", user.email)
    }
  }, [user, setValue])

  /**
   * Handle form submission
   * @param data - Form data validated by Zod schema
   */
  const onSubmit = async (data: Step2FormData) => {
    try {
      console.log("Step 2 submitted:", data)
      console.log("Current auth state - isAuthenticated:", isAuthenticated, "accessToken:", accessToken ? "present" : "missing")

      // Call signup completion API
      const signupCompleteData = {
        org_name: data.companyName,
        gst_number: data.gstNumber,
        cin_number: data.cinNumber,
        date_of_incorporation: data.dateOfIncorporation,
        ...(data.legalRegistrationType && { registration_type: data.legalRegistrationType }),
        ...(data.firstName && { first_name: data.firstName }),
        ...(data.lastName && { last_name: data.lastName }),
        ...(data.phoneNumber && { phone: data.phoneNumber }),
      }

      console.log("Calling completeSignup API with:", signupCompleteData)
      const result = await dispatch(completeSignup(signupCompleteData) as any)

      if (completeSignup.fulfilled.match(result)) {
        console.log("Signup completion successful:", result.payload)
        // Navigate to next step - don't pass data since step 3 expects different data
        onNext({} as any) // Pass empty object to trigger navigation
      } else {
        console.error("Signup completion failed:", result.payload)
      }
    } catch (error) {
      console.error("Step 2 error:", error)
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative">
      {/* Top Navbar */}
      <Navbar />

      {/* White gradient overlay in the middle */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent z-10 hidden lg:block"></div>

      {/* Left Content Section */}
      <div className="flex-1 relative pt-10">
        {/* Main Content */}
        <div className="flex items-start justify-center min-h-screen px-6 py-8 pt-24 relative z-20 ml-14">
          <div className="w-full max-w-2xl">
            {/* Form Title */}
            <div className="mb-8">
              <h1 className="text-[25px] font-[400] text-gray-800 font-[Baskervville]">
                Tell us about yourself
              </h1>
            </div>

            {/* Progress Tracker */}
            <ProgressTracker currentStep={1} totalSteps={3} />



            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name Fields Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Input
                    {...register("firstName")}
                    placeholder="First Name *"
                    className={cn(
                      "w-full h-11 px-4 py-3 rounded-lg focus:outline-none focus:ring-0 focus:border-transparent transition-colors bg-[#F5F5F5]",
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
                    placeholder="Last Name *"
                    className={cn(
                      "w-full h-11 px-4 py-3 rounded-lg focus:outline-none focus:ring-0 focus:border-transparent transition-colors bg-[#F5F5F5]",
                      errors.lastName ? "border-red-500" : "gradient-border"
                    )}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              {/* Email and Phone Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Input
                    {...register("designation")}
                    placeholder="Email Address *"
                    type="email"
                    disabled
                    value={user?.email || ""}
                    className={cn(
                      "w-full h-11 px-4 py-3 rounded-lg focus:outline-none focus:ring-0 focus:border-transparent transition-colors bg-gray-100 cursor-not-allowed",
                      errors.designation ? "border-red-500" : "gradient-border"
                    )}
                  />
                  {errors.designation && (
                    <p className="text-red-500 text-sm">{errors.designation.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Input
                    {...phoneNumberRegister}
                    onChange={handlePhoneNumberChange}
                    placeholder="+91 XXXXXXXXXX"
                    type="tel"
                    maxLength={13}
                    className={cn(
                      "w-full h-11 px-4 py-3 rounded-lg focus:outline-none focus:ring-0 focus:border-transparent transition-colors bg-[#F5F5F5]",
                      errors.phoneNumber ? "border-red-500" : "gradient-border"
                    )}
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>
                  )}
                </div>
              </div>

              {/* Company Name */}
              <div className="space-y-1">
                <Input
                  {...register("companyName")}
                  placeholder="Name of Organization*"
                  className={cn(
                    "w-full h-11 px-4 py-3 rounded-lg focus:outline-none focus:ring-0 focus:border-transparent transition-colors bg-[#F5F5F5]",
                    errors.companyName ? "border-red-500" : "gradient-border"
                  )}
                />
                {errors.companyName && (
                  <p className="text-red-500 text-sm">{errors.companyName.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6 border-b border-gray-200">
                  {/* Date of Incorporation */}
                  <div className="space-y-1">
                    <div className="relative">
                      <Input
                        {...register("dateOfIncorporation")}
                        type="date"
                        placeholder="Date of Incorporation *"
                        className={cn(
                          "w-full h-11 px-4 py-3 rounded-lg focus:outline-none focus:ring-0 focus:border-transparent transition-colors bg-[#F5F5F5]",
                          errors.dateOfIncorporation ? "border-red-500" : "gradient-border"
                        )}
                        onFocus={(e) => {
                          // e.target.type = 'date';
                          // Set max date to today (no future dates allowed)
                          const today = new Date().toISOString().split('T')[0];
                          e.target.setAttribute('max', today);
                          e.target.showPicker?.();
                        }}
                        onBlur={(e) => {
                          if (!e.target.value) {
                            e.target.type = 'text';
                          }
                        }}
                      />
                    </div>
                    {errors.dateOfIncorporation && (
                      <p className="text-red-500 text-sm">{errors.dateOfIncorporation.message}</p>
                    )}
                  </div>

                  {/* DPIIT Number */}
                  <div className="space-y-1">
                    <Input
                      {...register("gstNumber")}
                      placeholder="DPIIT Number"
                      className={cn(
                        "w-full h-11 px-4 py-3 rounded-lg focus:outline-none focus:ring-0 focus:border-transparent transition-colors bg-[#F5F5F5]",
                        errors.gstNumber ? "border-red-500" : "gradient-border"
                      )}
                    />
                    {errors.gstNumber && (
                      <p className="text-red-500 text-sm">{errors.gstNumber.message}</p>
                    )}
                  </div>
                </div>

              {/* Legal Registration Type */}
              <div className="space-y-4">
                <label className="text-[15px] font-[500] text-gray-700 font-golos">
                  Legal Registration Type
                </label>
                {metaLoading ? (
                  <div className="text-sm text-gray-500">Loading registration types...</div>
                ) : (
                  <RadioGroup
                    value={selectedRegistrationType}
                    onValueChange={(value) => setValue("legalRegistrationType", value)}
                    className="grid grid-cols-2 gap-4 pt-2"
                  >
                    {options?.registration_types?.map((type) => (
                      <div key={type.key} className="flex items-center space-x-2">
                        <RadioGroupItem value={type.key} id={type.key} />
                        <label htmlFor={type.key} className="text-[13px] font-[300] font-golos cursor-pointer">
                          {type.label}
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              </div>

              {/* Additional Fields */}
              <div className="space-y-4">
                {/* CIN Number */}
                <div className="space-y-1">
                    <Input
                      {...register("cinNumber")}
                      placeholder="Enter CIN No.*"
                      className={cn(
                        "w-full h-11 px-4 py-3 rounded-lg focus:outline-none focus:ring-0 focus:border-transparent transition-colors bg-[#F5F5F5]",
                        errors.cinNumber ? "border-red-500" : "gradient-border"
                      )}
                    />
                    {errors.cinNumber && (
                      <p className="text-red-500 text-sm">{errors.cinNumber.message}</p>
                    )}
                </div>
              </div>

              {/* Error Display */}
              {signupError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{signupError}</p>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-start pt-6">
                <Button
                  type="submit"
                  disabled={signupLoading}
                  className="w-full max-w-xs h-12 text-black font-medium rounded-lg gradient-bg hover:opacity-90 transition-opacity"
                >
                  {signupLoading ? "Completing Profile..." : "Continue"}
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
         <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent z-10"></div>

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
