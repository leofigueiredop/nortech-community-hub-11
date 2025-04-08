
import React, { ReactNode } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import SettingsSidebar from '@/components/settings/SettingsSidebar';

interface SettingsLayoutProps {
  children: ReactNode;
  activeSection?: string;
  title?: string;
}

const SettingsLayout: React.FC<SettingsLayoutProps> = ({ 
  children, 
  activeSection = "general",
  title
}) => {
  return (
    <MainLayout>
      <div className="flex h-full">
        <div className="hidden md:block w-64 h-full overflow-y-auto border-r border-gray-200 dark:border-gray-700">
          <SettingsSidebar activeSection={activeSection} />
        </div>
        
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700 p-6">
            <h1 className="text-2xl font-bold">
              {title || activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Settings
            </h1>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            {children}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsLayout;
