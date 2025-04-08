
import React from 'react';
import SettingsLayout from '@/components/settings/SettingsLayout';
import DomainSettings from '@/components/settings/DomainSettings';

const Domain: React.FC = () => {
  return (
    <SettingsLayout activeSection="domain" title="Custom Domain">
      <DomainSettings />
    </SettingsLayout>
  );
};

export default Domain;
