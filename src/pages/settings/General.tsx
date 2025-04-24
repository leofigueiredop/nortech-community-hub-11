
import React from 'react';
import SettingsLayout from '@/components/settings/SettingsLayout';
import GeneralSettings from '@/components/settings/GeneralSettings';

const General: React.FC = () => {
  return (
    <SettingsLayout activeSection="general" title="General Settings">
      <GeneralSettings />
    </SettingsLayout>
  );
};

export default General;
