import React, { createContext, useContext, useState } from 'react';
import Header from '@/components/layout/Header';
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import SidebarMenuContent from './SidebarMenuContent';

// Create a context to manage and share the view state
interface ViewContextType {
  viewAs: string;
  setViewAs: (role: string) => void;
}

export const ViewContext = createContext<ViewContextType>({
  viewAs: 'admin',
  setViewAs: () => {},
});

export const useViewContext = () => useContext(ViewContext);

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, title }) => {
  const { isMobile } = useIsMobile();
  const [viewAs, setViewAs] = useState('admin');
  
  return (
    <ViewContext.Provider value={{ viewAs, setViewAs }}>
      <SidebarProvider defaultOpen={!isMobile}>
        <div className="flex min-h-screen w-full">
          <Sidebar className="border-r border-border shadow-md bg-gradient-to-b from-slate-100 to-white dark:from-slate-900 dark:to-slate-950">
            <SidebarContent>
              <SidebarMenuContent />
            </SidebarContent>
          </Sidebar>
          
          <div className="flex-1 min-w-0 flex flex-col bg-slate-50 dark:bg-slate-950">
            <Header title={title}>
              <SidebarTrigger className="mr-2 md:hidden" />
            </Header>
            <div className="flex-1 px-3 py-4 md:px-6 md:py-6 overflow-auto">
              {children}
            </div>
          </div>
        </div>
      </SidebarProvider>
    </ViewContext.Provider>
  );
};

export default MainLayout;
