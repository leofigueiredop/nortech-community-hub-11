
import React from 'react';
import OnboardingLayout from '../OnboardingLayout';
import CommunityTemplatesForm from '@/components/onboarding/CommunityTemplatesForm';

const CommunityTemplates: React.FC = () => {
  return (
    <OnboardingLayout>
      <CommunityTemplatesForm />
    </OnboardingLayout>
  );
};

export default CommunityTemplates;
