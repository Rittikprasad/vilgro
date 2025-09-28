import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
// SignupStep1 removed - "Tell us about yourself" is now step 1 (SignupStep2)
import SignupStep2 from './SignupStep2';
import SignupStep3 from './SignupStep3';
import SignupStep4 from './SignupStep4';
import SignupStep5 from './SignupStep5';
import { fetchMetaOptions } from '../../features/meta/metaSlice';
import { resetSignup } from '../../features/signup/signupSlice';
import { fetchOnboardingProgress, updateStep2, updateStep3, finishOnboarding } from '../../features/onboarding/onboardingSlice';
import type { RootState } from '../../app/store';
import type { Step2Request, Step3Request } from '../../features/onboarding/onboardingTypes';

export interface SignupData {
  step1?: any;
  step2?: any;
  step3?: any;
  step4?: any;
  step5?: any;
}

interface SignupFlowProps {
  initialStep?: number;
}

/**
 * Main signup flow component that manages the multi-step process
 * Handles navigation between steps and data collection using URL query parameters
 */
const SignupFlow: React.FC<SignupFlowProps> = ({ initialStep }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { options, isLoading: metaLoading } = useSelector((state: RootState) => state.meta);
  const { progress: onboardingProgress } = useSelector((state: RootState) => state.onboarding);

  // Get current step from URL query parameter, fallback to initialStep or 1
  // Note: "Tell us about yourself" is step 1 as expected by backend
  const currentStep = parseInt(searchParams.get('step') || initialStep?.toString() || '1', 10);
  const [signupData, setSignupData] = useState<SignupData>({});

  // Fetch meta options when component mounts
  useEffect(() => {
    if (!options && !metaLoading) {
      dispatch(fetchMetaOptions() as any);
    }
  }, [dispatch, options, metaLoading]);

  // Fetch onboarding progress for returning users
  useEffect(() => {
    if (currentStep > 1) {
      // This is a returning user, fetch their progress
      console.log('Returning user detected, fetching onboarding progress...');
      dispatch(fetchOnboardingProgress() as any);
    }
  }, [dispatch, currentStep]);

  // Pre-fill form data when onboarding progress is loaded
  useEffect(() => {
    if (onboardingProgress && onboardingProgress.data) {
      console.log('Pre-filling form data from onboarding progress:', onboardingProgress.data);
      setSignupData(prev => ({
        ...prev,
        ...onboardingProgress.data
      }));
    }
  }, [onboardingProgress]);

  // Reset signup state when component unmounts
  useEffect(() => {
    return () => {
      dispatch(resetSignup());
    };
  }, [dispatch]);

  const handleNext = async (stepData: any) => {
    const stepKey = `step${currentStep}`;
    setSignupData(prev => ({
      ...prev,
      [stepKey]: stepData,
    }));

    // Navigate based on current step - "Tell us about yourself" is step 1
    if (currentStep === 1) {
      // After "Tell us about yourself" (Step 1), go to Innovation + Geography (Onboarding Step 2)
      setSearchParams({ step: '2' });
    } else if (currentStep === 2) {
      // This is Innovation + Geography step - call onboarding API (Onboarding Step 2)
      try {
        const onboardingData: Step2Request = {
          type_of_innovation: stepData.innovationType,
          geo_scope: stepData.geographicScope,
          top_states: [stepData.state1, stepData.state2, stepData.state3, stepData.state4, stepData.state5].filter(Boolean)
        };

        console.log('Calling updateStep2 API with:', onboardingData);
        const result = await dispatch(updateStep2(onboardingData) as any);

        if (updateStep2.fulfilled.match(result)) {
          console.log('Onboarding Step 2 API success, moving to Sector + Stage + Impact (Step 3)');
          setSearchParams({ step: '3' });
        } else {
          console.error('Onboarding Step 2 API failed:', result.payload);
        }
      } catch (error) {
        console.error('Onboarding Step 2 error:', error);
      }
    } else if (currentStep === 3) {
      // This is Sector + Stage + Impact step - call onboarding API (Onboarding Step 3)
      try {
        const onboardingData: Step3Request = {
          focus_sector: stepData.focusSector,
          org_stage: stepData.stage,
          impact_focus: stepData.impactFocus,
          annual_operating_budget: "0", // Will be filled in step 4
          use_of_questionnaire: "FUNDING", // Default value
          received_philanthropy_before: false // Default value
        };

        console.log('Calling updateStep3 API with partial data:', onboardingData);
        const result = await dispatch(updateStep3(onboardingData) as any);

        if (updateStep3.fulfilled.match(result)) {
          console.log('Onboarding Step 3 API success, moving to Budget and funding (Step 4)');
          setSearchParams({ step: '4' });
        } else {
          console.error('Onboarding Step 3 API failed:', result.payload);
        }
      } catch (error) {
        console.error('Onboarding Step 3 error:', error);
      }
    } else {
      setSearchParams({ step: (currentStep + 1).toString() });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setSearchParams({ step: (currentStep - 1).toString() });
    }
  };

  const handleComplete = async (finalData: any) => {
    const completeData = {
      ...signupData,
      [`step${currentStep}`]: finalData,
    };
    console.log('Complete signup data:', completeData);

    // This is step 5 - Budget and funding step
    try {
      // Combine step 4 and step 5 data for final onboarding API call
      const step4Data = signupData.step4 || {};
      const onboardingData: Step3Request = {
        focus_sector: step4Data.focusSector,
        org_stage: step4Data.stage,
        impact_focus: step4Data.impactFocus,
        annual_operating_budget: finalData.annualBudget,
        use_of_questionnaire: finalData.fundingSource,
        received_philanthropy_before: finalData.philanthropicFunding === 'yes'
      };

      console.log('Calling updateStep3 API with complete data:', onboardingData);
      const result = await dispatch(updateStep3(onboardingData) as any);

      if (updateStep3.fulfilled.match(result)) {
        console.log('Step 3 API success, finishing onboarding');
        // Now finish onboarding
        const finishResult = await dispatch(finishOnboarding() as any);

        if (finishOnboarding.fulfilled.match(finishResult)) {
          console.log('Onboarding completed successfully');
          navigate('/welcome');
        } else {
          console.error('Finish onboarding failed:', finishResult.payload);
        }
      } else {
        console.error('Step 3 API failed:', result.payload);
      }
    } catch (error) {
      console.error('Complete signup error:', error);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        // Step 1: "Tell us about yourself" - Personal info + signup completion
        return <SignupStep2 onNext={handleNext} onBack={handleBack} />;
      case 2:
        // Step 2: Innovation + Geography (Onboarding Step 2)
        return <SignupStep3 onNext={handleNext} onBack={handleBack} />;
      case 3:
        // Step 3: Sector + Stage + Impact (Onboarding Step 3)
        return <SignupStep4 onNext={handleNext} onBack={handleBack} />;
      case 4:
        // Step 4: Budget and funding (Onboarding Step 3 completion)
        return <SignupStep5 onComplete={handleComplete} onBack={handleBack} />;
      default:
        // Default to step 1: "Tell us about yourself"
        return <SignupStep2 onNext={handleNext} onBack={handleBack} />;
    }
  };

  return (
    <div className="min-h-screen">

      {renderCurrentStep()}
    </div>
  );
};

export default SignupFlow;
