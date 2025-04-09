
import React from 'react';
import OnboardingLayout from '../OnboardingLayout';
import { ProfileForm } from '@/components/onboarding/ProfileForm';
import { ProfilePointsInfo } from '@/components/onboarding/ProfileForm';

const Profile: React.FC = () => {
  return (
    <OnboardingLayout>
      <ProfileForm />
    </OnboardingLayout>
  );
};

export default Profile;
