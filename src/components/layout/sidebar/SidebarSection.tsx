
import React from 'react';
import { SidebarGroup, SidebarGroupLabel, SidebarMenu } from '@/components/ui/sidebar';

interface SidebarSectionProps {
  title: string;
  children: React.ReactNode;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({ title, children }) => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="uppercase tracking-wider font-medium text-2xs text-purple-500/70 dark:text-purple-400/70 pb-0.5">
        {title}
      </SidebarGroupLabel>
      <SidebarMenu className="space-y-1">
        {children}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default SidebarSection;
