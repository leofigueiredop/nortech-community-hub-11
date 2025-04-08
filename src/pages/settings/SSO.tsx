
import React from 'react';
import SettingsLayout from '@/components/settings/SettingsLayout';
import SSOSettings from '@/components/settings/SSOSettings';

const SSO: React.FC = () => {
  return (
    <SettingsLayout activeSection="sso" title="Single Sign-On">
      <SSOSettings />
    </SettingsLayout>
  );
};

export default SSO;
