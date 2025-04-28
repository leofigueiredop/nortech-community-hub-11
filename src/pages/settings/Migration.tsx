
import React from 'react';
import SettingsLayout from '@/components/settings/SettingsLayout';
import MigrationSettings from '@/components/settings/MigrationSettings';

const Migration: React.FC = () => {
  return (
    <SettingsLayout activeSection="migration" title="Migration & Database">
      <MigrationSettings />
    </SettingsLayout>
  );
};

export default Migration;
