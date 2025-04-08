
import React from 'react';
import SettingsLayout from '@/components/settings/SettingsLayout';
import MobileSettings from '@/components/settings/MobileSettings';

const Mobile: React.FC = () => {
  return (
    <SettingsLayout activeSection="mobile">
      <MobileSettings />
    </SettingsLayout>
  );
};

export default Mobile;
