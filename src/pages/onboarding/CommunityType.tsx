
import React from 'react';
import OnboardingLayout from '../OnboardingLayout';
import CommunityTypeForm from '@/components/onboarding/CommunityTypeForm';

const CommunityType: React.FC = () => {
  return (
    <OnboardingLayout>
      <CommunityTypeForm />
    </OnboardingLayout>
  );
};

export default CommunityType;
