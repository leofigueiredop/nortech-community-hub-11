
import React from 'react';
import SettingsLayout from '@/components/settings/SettingsLayout';
import IntegrationSettings from '@/components/settings/IntegrationSettings';

const Integration: React.FC = () => {
  return (
    <SettingsLayout activeSection="integration" title="Integrations">
      <IntegrationSettings />
    </SettingsLayout>
  );
};

export default Integration;
