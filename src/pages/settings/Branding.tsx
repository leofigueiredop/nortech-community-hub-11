
import React from 'react';
import SettingsLayout from '@/components/settings/SettingsLayout';
import BrandingSettings from '@/components/settings/BrandingSettings';

const Branding: React.FC = () => {
  return (
    <SettingsLayout activeSection="branding">
      <BrandingSettings />
    </SettingsLayout>
  );
};

export default Branding;
