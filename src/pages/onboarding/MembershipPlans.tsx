
import React from 'react';
import OnboardingLayout from '../OnboardingLayout';
import MembershipPlansForm from '@/components/onboarding/MembershipPlansForm';

const MembershipPlans: React.FC = () => {
  return (
    <OnboardingLayout>
      <MembershipPlansForm />
    </OnboardingLayout>
  );
};

export default MembershipPlans;
