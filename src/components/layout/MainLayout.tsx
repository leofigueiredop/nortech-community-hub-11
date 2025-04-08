import React from 'react';
import Header from './Header';
import { SidebarProvider, Sidebar, SidebarContent } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import SidebarMenuContent from './SidebarMenuContent';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { isMobile } = useIsMobile();
  
  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar className="border-r border-border">
        <SidebarContent>
          <SidebarMenuContent />
        </SidebarContent>
      </Sidebar>
      
      <div className="flex-1 min-w-0 min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
        <Header />
        <div className="flex-1 px-6 py-6 overflow-auto">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
