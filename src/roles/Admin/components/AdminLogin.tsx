import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Link, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { useEffect } from "react"
import { Input } from "../../../components/ui/Input"
import { Button } from "../../../components/ui/Button"
import { cn } from "../../../lib/utils"
import logo from "../../../assets/logo.png"
import { BackgroundGradients } from "../../../components/ui/BackgroundGradients"
import { login } from "../../../features/auth/authThunks"
import { clearError } from "../../../features/auth/authSlice"
import type { RootState } from "../../../app/store"

// Validation schema for admin login form
const adminLoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required"),
})

type AdminLoginFormData = z.infer<typeof adminLoginSchema>

/**
 * Admin Login Component
 * Features same design as SPO login but without signup option
 * Admin credentials are pre-created by backend
 */
const AdminLogin: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoading, error, isAuthenticated, user } = useSelector((state: RootState) => state.auth)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
  })

  // Handle navigation after successful authentication
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log("User authenticated, navigating to admin dashboard")
      navigate("/admin/dashboard", { replace: true })
    }
  }, [isAuthenticated, user, navigate])

  /**
   * Handle form submission
   * @param data - Form data validated by Zod schema
   */
  const onSubmit = async (data: AdminLoginFormData) => {
    try {
      console.log("Admin login form submitted:", data)

      // Clear any previous errors
      dispatch(clearError())

      // Dispatch login action
      const result = await dispatch(login(data) as any)

      if (login.fulfilled.match(result)) {
        console.log("Admin login successful:", result.payload)

        // For now, accept any role (will be ADMIN later)
        // if (result.payload?.user?.role !== "ADMIN") {
        //   console.error("Non-admin user attempted to login via admin portal")
        //   // Handle non-admin login attempt
        //   // You can show an error message here
        // }

        // Navigation will be handled by useEffect when authentication state changes
        console.log("Login completed, navigation will be handled by useEffect")
      } else if (login.rejected.match(result)) {
        console.error("Login failed:", result.payload)
      }
    } catch (error) {
      console.error("Admin login error:", error)
    }
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background decorative elements */}
      <BackgroundGradients />

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen px-6">
        <div className="w-full max-w-4xl flex justify-center">
          <div className="w-full max-w-md">
            {/* Logo Section */}
            <div className="flex justify-center items-center mb-8">
              <img src={logo} alt="logo" className="object-contain w-[173.238px] h-[71.721px]" />
            </div>

            {/* Form Title */}
            <div className="text-center mb-8">
              <h1 className="text-[30px] font-semibold text-[#231f20] leading-[1.24] font-['Baskervville']">
                Admin <span className="text-[#46b753]">Portal</span>
              </h1>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-1">
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="Email ID"
                  className={cn(
                    "w-[512px] h-12 px-4 py-3 rounded-lg bg-white border border-[#46b753] focus:outline-none focus:ring-0 focus:border-[#46b753] text-[16px] placeholder:text-[#a8a8a8]",
                    errors.email && "border-red-500"
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
                    "w-[512px] h-12 px-4 py-3 rounded-lg bg-white border border-[#46b753] focus:outline-none focus:ring-0 focus:border-[#46b753] text-[16px] placeholder:text-[#a8a8a8]",
                    errors.password && "border-red-500"
                  )}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password.message}</p>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-center">
                  <p className="text-red-500 text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-center">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-[300px] h-12 text-black font-medium rounded-lg gradient-bg hover:opacity-90 transition-opacity"
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </div>
            </form>

            {/* Forget Password Link */}
            <div className="text-center mt-6">
              <Link
                to="/admin/forgot-password"
                className="text-[14px] text-[#46b753] underline hover:underline cursor-pointer"
              >
                Forgot Password
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin

