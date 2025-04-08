
import React from 'react';
import SettingsLayout from '@/components/settings/SettingsLayout';
import MessagingSettings from '@/components/settings/MessagingSettings';

const Messaging: React.FC = () => {
  return (
    <SettingsLayout activeSection="messaging">
      <MessagingSettings />
    </SettingsLayout>
  );
};

export default Messaging;
