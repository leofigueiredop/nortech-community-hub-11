
import React, { ReactNode } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
      <Sheet open={true} onOpenChange={(open) => !open && handleClose()}>
        <SheetContent 
          side="right" 
          className="w-full sm:max-w-3xl border-l border-gray-200 dark:border-gray-700 p-0 overflow-y-auto"
        >
          <div className="flex flex-col h-full">
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
        </SheetContent>
      </Sheet>
    </MainLayout>
  );
};

export default SettingsLayout;
