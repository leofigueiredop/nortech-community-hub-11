
import React from 'react';
import SettingsLayout from '@/components/settings/SettingsLayout';
import NotificationSettings from '@/components/settings/NotificationSettings';

const Notifications: React.FC = () => {
  return (
    <SettingsLayout activeSection="notifications" title="Notifications">
      <NotificationSettings />
    </SettingsLayout>
  );
};

export default Notifications;
