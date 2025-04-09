
import React from 'react';
import SettingsLayout from '@/components/settings/SettingsLayout';
import PointsConfigurationPanel from '@/components/settings/points/PointsConfigurationPanel';

const PointsConfiguration: React.FC = () => {
  return (
    <SettingsLayout activeSection="points" title="Points Configuration">
      <PointsConfigurationPanel />
    </SettingsLayout>
  );
};

export default PointsConfiguration;
