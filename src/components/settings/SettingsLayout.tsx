
import React, { ReactNode, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import SettingsSidebar from '@/components/settings/SettingsSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const { isMobile } = useIsMobile();
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const toggleMobileSidebar = () => {
    setShowMobileSidebar(!showMobileSidebar);
  };
  
  return (
    <MainLayout>
      <div className="flex flex-col h-full bg-white dark:bg-slate-900">
        {isMobile && (
          <div className="border-b border-gray-200 dark:border-gray-800 p-2">
            <Button 
              variant="outline" 
              className="w-full flex justify-between items-center text-sm"
              onClick={toggleMobileSidebar}
            >
              <span>Settings Menu</span>
              {showMobileSidebar ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>
            
            {showMobileSidebar && (
              <div className="mt-2 border rounded-md overflow-hidden">
                <SettingsSidebar activeSection={activeSection} />
              </div>
            )}
          </div>
        )}
        
        <div className="flex h-full overflow-y-auto">
          <div className="hidden md:block w-56 h-full overflow-y-auto border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-slate-800">
            <SettingsSidebar activeSection={activeSection} />
          </div>
          
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <div className="border-b border-gray-200 dark:border-gray-800 p-3 md:p-4">
              <h1 className="text-lg md:text-xl font-semibold">
                {title || activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Settings
              </h1>
            </div>
            <div className="flex-1 overflow-y-auto p-3 md:p-5">
              {children}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsLayout;
