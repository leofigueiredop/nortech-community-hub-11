
import React from 'react';
import SettingsLayout from '@/components/settings/SettingsLayout';
import SubscriptionSettings from '@/components/settings/SubscriptionSettings';

const Subscriptions: React.FC = () => {
  return (
    <SettingsLayout activeSection="subscriptions" title="Subscription Plans">
      <SubscriptionSettings />
    </SettingsLayout>
  );
};

export default Subscriptions;
