
import React, { useState } from 'react';
import { OnboardingLayout } from './OnboardingLayout';
import { RoleSelection } from './steps/RoleSelection';
import { EmailEntry } from './steps/EmailEntry';
import { AccountDetails } from './steps/AccountDetails';
import { WelcomeTransition } from './components/WelcomeTransition';
import { OnboardingStep, UserData } from '../../types';

interface OnboardingFlowProps {
  onFinish: (data: UserData) => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onFinish }) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(OnboardingStep.ROLE_SELECTION);
  const [userData, setUserData] = useState<UserData>({
    role: null,
    email: '',
    firstName: '',
    lastName: '',
    companyName: ''
  });

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, OnboardingStep.COMPLETION));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, OnboardingStep.ROLE_SELECTION));
  };

  const handleRoleSelect = (roleId: string) => {
    setUserData({ ...userData, role: roleId });
    nextStep();
  };

  const handleEmailSubmit = (email: string) => {
    setUserData({ ...userData, email });
    nextStep();
  };

  const handleDetailsSubmit = (details: Partial<UserData>) => {
    setUserData(prev => {
      const updated = { ...prev, ...details };
      return updated;
    });
    nextStep();
  };

  // Replace standard finish with custom transition component
  if (currentStep === OnboardingStep.COMPLETION) {
    return (
      <WelcomeTransition 
        userData={userData} 
        onFinish={() => onFinish(userData)} 
      />
    );
  }

  return (
    <OnboardingLayout step={currentStep}>
      {currentStep === OnboardingStep.ROLE_SELECTION && (
        <RoleSelection 
          onSelect={handleRoleSelect} 
          selectedRole={userData.role} 
        />
      )}
      {currentStep === OnboardingStep.EMAIL_ENTRY && (
        <EmailEntry 
          onBack={prevStep} 
          onNext={handleEmailSubmit}
          initialEmail={userData.email}
        />
      )}
      {currentStep === OnboardingStep.ACCOUNT_DETAILS && (
        <AccountDetails 
          onBack={prevStep} 
          onComplete={handleDetailsSubmit}
          role={userData.role}
        />
      )}
    </OnboardingLayout>
  );
};
