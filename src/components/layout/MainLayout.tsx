
import React, { ReactNode } from 'react';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent,
  SidebarTrigger,
  SidebarRail
} from '@/components/ui/sidebar';
import Header from './Header';
import SidebarMenuContent from './SidebarMenu';

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, title }) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-gray-50 dark:bg-nortech-dark-bg">
        <Sidebar>
          <SidebarContent>
            <SidebarMenuContent />
          </SidebarContent>
          <SidebarRail />
        </Sidebar>
        <div className="flex-1 flex flex-col">
          <Header title={title} />
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
