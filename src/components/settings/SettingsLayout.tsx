
import React, { ReactNode } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  
  const handleClose = () => {
    navigate('/dashboard');
  };

  return (
    <MainLayout>
      <Dialog open={true} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent 
          className="max-w-6xl w-[95vw] h-[90vh] p-0 overflow-hidden flex"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <SettingsSidebar activeSection={activeSection} />
          
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold">
                {title || activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Settings
              </h2>
              <Button variant="ghost" size="icon" onClick={handleClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {children}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default SettingsLayout;
