
import React from 'react';
import { SidebarGroup, SidebarGroupLabel, SidebarMenu } from '@/components/ui/sidebar';

interface SidebarSectionProps {
  title: string;
  children: React.ReactNode;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({ title, children }) => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="uppercase tracking-wider font-bold text-xs text-purple-600 dark:text-purple-400">
        {title}
      </SidebarGroupLabel>
      <SidebarMenu className="space-y-1.5">
        {children}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default SidebarSection;
