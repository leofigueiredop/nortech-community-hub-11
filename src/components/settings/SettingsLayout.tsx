
import React, { ReactNode } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import SettingsSidebar from './SettingsSidebar';

interface SettingsLayoutProps {
  children: ReactNode;
  activeSection?: string;
}

const SettingsLayout: React.FC<SettingsLayoutProps> = ({ children, activeSection = "general" }) => {
  return (
    <MainLayout title="Settings">
      <div className="flex h-full">
        <SettingsSidebar activeSection={activeSection} />
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50 dark:bg-gray-900">
          {children}
        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsLayout;
