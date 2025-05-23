
import React from 'react';
import SettingsLayout from '@/components/settings/SettingsLayout';
import PricingPlans from '@/components/settings/PricingPlans';

const Plans: React.FC = () => {
  return (
    <SettingsLayout activeSection="plans" title="Nortech Platform Plans">
      <PricingPlans />
    </SettingsLayout>
  );
};

export default Plans;
