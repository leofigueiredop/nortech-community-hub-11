
import React from 'react';
import SettingsLayout from '@/components/settings/SettingsLayout';
import DefaultsSettings from '@/components/settings/DefaultsSettings';

const Defaults: React.FC = () => {
  return (
    <SettingsLayout activeSection="defaults">
      <DefaultsSettings />
    </SettingsLayout>
  );
};

export default Defaults;
