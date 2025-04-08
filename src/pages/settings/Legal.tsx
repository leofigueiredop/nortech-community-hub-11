
import React from 'react';
import SettingsLayout from '@/components/settings/SettingsLayout';
import LegalSettings from '@/components/settings/LegalSettings';

const Legal: React.FC = () => {
  return (
    <SettingsLayout activeSection="legal">
      <LegalSettings />
    </SettingsLayout>
  );
};

export default Legal;
