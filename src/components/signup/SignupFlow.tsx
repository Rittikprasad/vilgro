import React, { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOnboardingProgress,
  setStep3Data,
  updateStep2,
  updateStep3,
  finishOnboarding
} from "../../features/onboarding/onboardingSlice";
import type { RootState } from "../../app/store";

// ✅ Your existing UI components (no UI changes)
import SignupStep1 from "./SignupStep1"; // Create account
import SignupStep2 from "./SignupStep2"; // Innovation + Geography  
import SignupStep3 from "./SignupStep3"; // Innovation + Geography
import SignupStep4 from "./SignupStep4"; // Sector + Stage + Impact
import SignupStep5 from "./SignupStep5"; // Budget + Funding
import ProgressTracker from "../ui/ProgressTracker";

const SignupFlow: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const currentStep = Number(location.pathname.split("/").pop()) || 1;

  const { progress } = useSelector((state: RootState) => state.onboarding);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Redirect if not logged in (except for step 1 - account creation)
  useEffect(() => {
    if (!isAuthenticated && currentStep > 1) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate, currentStep]);

  // Fetch onboarding progress only if user is authenticated and we don't have local data
  useEffect(() => {
    if (isAuthenticated && currentStep > 1) {
      // Only fetch from server if we don't have local step 3 data stored
      const hasLocalStep3Data = progress?.data?.focusSector || progress?.data?.stage || progress?.data?.impactFocus;
      if (!hasLocalStep3Data) {
        dispatch(fetchOnboardingProgress() as any);
      }
    }
  }, [dispatch, isAuthenticated, currentStep]);

  // Prevent returning to step 1 if already completed
  useEffect(() => {
    if (progress?.current_step && progress.current_step > 1 && currentStep === 1) {
      navigate(`/signup/step/${progress.current_step}`, { replace: true });
    }
  }, [progress, currentStep, navigate]);

  // ------------------------
  // Step Handlers
  // ------------------------

  // Step 1 - Account Creation (already handled by SignupStep1)
  const handleStep1Next = async () => {
    // Account creation is already handled by SignupStep1 component
    // Just navigate to step 2 after successful account creation
    console.log("Account created successfully, navigating to step 2");
    navigate("/signup/step/2");
  };

  // Step 2 - Personal/Company Info (already handled by SignupStep2)
  const handleStep2Next = async () => {
    if (!isAuthenticated) {
      console.error("User must be authenticated to proceed to step 2");
      return;
    }
    // SignupStep2 handles completeSignup internally
    // Just navigate to step 3 (which collects innovation/geography data)
    console.log("Step 2 completed, navigating to step 3");
    navigate("/signup/step/3");
  };

  // Step 3 - Innovation + Geography
  const handleStep3Next = async (formData: any) => {
    if (!isAuthenticated) {
      console.error("User must be authenticated to proceed to step 3");
      return;
    }
    const payload = {
      type_of_innovation: formData.innovationType,
      geo_scope: formData.geographicScope,
      top_states: [
        formData.state1,
        formData.state2,
        formData.state3,
        formData.state4,
        formData.state5
      ].filter(Boolean),
    };
    const result = await dispatch(updateStep2(payload) as any);
    if (updateStep2.fulfilled.match(result)) navigate("/signup/step/4");
  };

  // Step 4 - Sector + Stage + Impact
  const handleStep4Next = (formData: any) => {
    if (!isAuthenticated) {
      console.error("User must be authenticated to proceed to step 4");
      return;
    }
    console.log("Step 4 - FormData being stored:", formData);
    dispatch(setStep3Data(formData));
    console.log("Step 4 - Data dispatched to setStep3Data");
    navigate("/signup/step/5");
  };

  // Step 5 - Budget + Funding
  const handleStep5Complete = async (formData: any) => {
    if (!isAuthenticated) {
      console.error("User must be authenticated to complete step 5");
      return;
    }
    const step3Data = progress?.data;
    console.log("Step 5 - Progress data:", progress);
    console.log("Step 5 - Step3Data:", step3Data);
    console.log("Step 5 - FormData:", formData);
    
    if (!step3Data?.focusSector || !step3Data?.stage || !step3Data?.impactFocus) {
      console.error("Missing step 3 data:", {
        focusSector: step3Data?.focusSector,
        stage: step3Data?.stage,
        impactFocus: step3Data?.impactFocus,
        fullStep3Data: step3Data
      });
      return;
    }
    const payload = {
      focus_sector: step3Data.focusSector,
      org_stage: step3Data.stage,
      impact_focus: step3Data.impactFocus,
      annual_operating_budget: formData.annualBudget,
      use_of_questionnaire: formData.fundingSource,
      received_philanthropy_before: formData.philanthropicFunding === "yes",
    };
    const result = await dispatch(updateStep3(payload) as any);
    if (updateStep3.fulfilled.match(result)) {
      const finish = await dispatch(finishOnboarding() as any);
      if (finishOnboarding.fulfilled.match(finish)) navigate("/assessment");
    }
  };

  // Back handlers
  const handleBack = () => {
    if (currentStep > 1) {
      navigate(`/signup/step/${currentStep - 1}`);
    }
  };

  // ------------------------
  // Rendering
  // ------------------------
  return (
    <div className="min-h-screen bg-white">
      {/* Show tracker only on Step 2–5 and when authenticated */}
      {currentStep > 1 && isAuthenticated && <ProgressTracker currentStep={currentStep - 1} totalSteps={3} />}

      <Routes>
        <Route path="step/1" element={<SignupStep1 onNext={handleStep1Next} />} />
        <Route path="step/2" element={<SignupStep2 onNext={handleStep2Next} />} />
        <Route path="step/3" element={<SignupStep3 onNext={handleStep3Next} onBack={handleBack} />} />
        <Route path="step/4" element={<SignupStep4 onNext={handleStep4Next} onBack={handleBack} />} />
        <Route path="step/5" element={<SignupStep5 onComplete={handleStep5Complete} onBack={handleBack} />} />
        <Route index element={<Navigate to="step/1" replace />} />
      </Routes>
    </div>
  );
};

export default SignupFlow;
