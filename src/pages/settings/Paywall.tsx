
import React from 'react';
import SettingsLayout from '@/components/settings/SettingsLayout';
import PaywallSettings from '@/components/settings/PaywallSettings';

const Paywall: React.FC = () => {
  return (
    <SettingsLayout activeSection="paywall" title="Paywall Configuration">
      <PaywallSettings />
    </SettingsLayout>
  );
};

export default Paywall;
