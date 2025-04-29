
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import SettingsMenu from '@/components/settings/SettingsMenu';

const SettingsIndex: React.FC = () => {
  return (
    <MainLayout title="Settings">
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <div className="flex flex-col gap-3 mb-8">
          <h1 className="text-3xl font-bold">Community Settings</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Configure and customize your Nortech community experience
          </p>
        </div>
        
        <SettingsMenu />
      </div>
    </MainLayout>
  );
};

export default SettingsIndex;
