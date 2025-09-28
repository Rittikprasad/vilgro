import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SignupStep1 from './SignupStep1';
import SignupStep2 from './SignupStep2';
import SignupStep3 from './SignupStep3';
import SignupStep4 from './SignupStep4';
import SignupStep5 from './SignupStep5';
import { fetchMetaOptions } from '../../features/meta/metaSlice';
import type { RootState } from '../../app/store';

export interface SignupData {
  step1?: any;
  step2?: any;
  step3?: any;
  step4?: any;
  step5?: any;
}

/**
 * Main signup flow component that manages the multi-step process
 * Handles navigation between steps and data collection
 */
const SignupFlow: React.FC = () => {
  const dispatch = useDispatch();
  const { options, isLoading: metaLoading } = useSelector((state: RootState) => state.meta);
  const [currentStep, setCurrentStep] = useState(1);
  const [signupData, setSignupData] = useState<SignupData>({});

  // Fetch meta options when component mounts
  useEffect(() => {
    if (!options && !metaLoading) {
      dispatch(fetchMetaOptions() as any);
    }
  }, [dispatch, options, metaLoading]);

  const handleNext = (stepData: any) => {
    setSignupData(prev => ({
      ...prev,
      [`step${currentStep}`]: stepData,
    }));
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleComplete = (finalData: any) => {
    const completeData = {
      ...signupData,
      [`step${currentStep}`]: finalData,
    };
    console.log('Complete signup data:', completeData);
    // Here you would typically send the data to your backend
    // For now, we'll just log it and redirect to dashboard
    alert('Signup completed successfully!');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <SignupStep1 onNext={handleNext} />;
      case 2:
        return <SignupStep2 onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <SignupStep3 onNext={handleNext} onBack={handleBack} />;
      case 4:
        return <SignupStep4 onNext={handleNext} onBack={handleBack} />;
      case 5:
        return <SignupStep5 onComplete={handleComplete} onBack={handleBack} />;
      default:
        return <SignupStep1 onNext={handleNext} />;
    }
  };

  return (
    <div className="min-h-screen">

      {renderCurrentStep()}
    </div>
  );
};

export default SignupFlow;
