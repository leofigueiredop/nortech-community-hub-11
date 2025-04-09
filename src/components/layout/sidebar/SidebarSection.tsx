
import React from 'react';
import { SidebarGroup, SidebarGroupLabel, SidebarMenu } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarSectionProps {
  title: string;
  children: React.ReactNode;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({ title, children }) => {
  const { isMobile } = useIsMobile();
  
  return (
    <SidebarGroup>
      <SidebarGroupLabel className={`uppercase tracking-wider font-normal text-xs text-purple-500/60 dark:text-purple-400/60 pb-0.5 ${isMobile ? 'text-[10px]' : ''}`}>
        {title}
      </SidebarGroupLabel>
      <SidebarMenu className={`space-y-1 text-xs ${isMobile ? 'space-y-0.5' : ''}`}>
        {children}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default SidebarSection;
