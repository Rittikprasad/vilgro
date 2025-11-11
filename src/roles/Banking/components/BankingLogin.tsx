import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { cn } from "../../../lib/utils";
import logo from "../../../assets/logo.png";
import { BackgroundGradients } from "../../../components/ui/BackgroundGradients";
import { login } from "../../../features/auth/authThunks";
import { clearError } from "../../../features/auth/authSlice";
import type { RootState } from "../../../app/store";

const bankingLoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required"),
});

type BankingLoginFormData = z.infer<typeof bankingLoginSchema>;

const BankingLogin: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BankingLoginFormData>({
    resolver: zodResolver(bankingLoginSchema),
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate("/banking/dashboard", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const onSubmit = async (data: BankingLoginFormData) => {
    try {
      dispatch(clearError());
      await dispatch(login(data) as any);
    } catch (err) {
      console.error("Banking login error:", err);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      <BackgroundGradients />
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="flex w-full max-w-4xl justify-center">
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center justify-center">
              <img
                src={logo}
                alt="logo"
                className="h-[71.721px] w-[173.238px] object-contain"
              />
            </div>

            <div className="mb-8 text-center">
              <h1 className="font-['Baskervville'] text-[30px] font-semibold leading-[1.24] text-[#231f20]">
                Banking <span className="text-[#46b753]">Portal</span>
              </h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1">
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="Email ID"
                  className={cn(
                    "h-12 w-[512px] rounded-lg border border-[#46b753] bg-white px-4 py-3 text-[16px] placeholder:text-[#a8a8a8] focus:border-[#46b753] focus:outline-none focus:ring-0",
                    errors.email && "border-red-500"
                  )}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <Input
                  {...register("password")}
                  type="password"
                  placeholder="Password"
                  className={cn(
                    "h-12 w-[512px] rounded-lg border border-[#46b753] bg-white px-4 py-3 text-[16px] placeholder:text-[#a8a8a8] focus:border-[#46b753] focus:outline-none focus:ring-0",
                    errors.password && "border-red-500"
                  )}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              {error && (
                <div className="text-center">
                  <p className="text-sm text-red-500">{error}</p>
                </div>
              )}

              <div className="flex justify-center">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="gradient-bg h-12 w-[300px] rounded-lg text-black transition-opacity hover:opacity-90"
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/banking/forgot-password"
                className="text-[14px] text-[#46b753] underline"
              >
                Forgot Password
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankingLogin;

