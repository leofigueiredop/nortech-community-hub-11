import React from 'react';
import OnboardingLayout from '../OnboardingLayout';
import InviteMembersForm from '@/components/onboarding/InviteMembersForm';

const InviteMembers: React.FC = () => {
  return (
    <OnboardingLayout>
      <InviteMembersForm />
    </OnboardingLayout>
  );
};

export default InviteMembers;
