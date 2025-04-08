
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
      <div className="flex h-full bg-white dark:bg-slate-900">
        <div className="hidden md:block w-56 h-full overflow-y-auto border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-slate-800">
          <SettingsSidebar activeSection={activeSection} />
        </div>
        
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-800 p-4">
            <h1 className="text-xl font-semibold">
              {title || activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Settings
            </h1>
          </div>
          <div className="flex-1 overflow-y-auto p-5">
            {children}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsLayout;
