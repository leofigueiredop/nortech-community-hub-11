
import React from 'react';
import SettingsLayout from '@/components/settings/SettingsLayout';
import DigestSettings from '@/components/settings/DigestSettings';

const Digest: React.FC = () => {
  return (
    <SettingsLayout activeSection="digest">
      <DigestSettings />
    </SettingsLayout>
  );
};

export default Digest;
