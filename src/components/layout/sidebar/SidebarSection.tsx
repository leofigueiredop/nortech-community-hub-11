
import React from 'react';
import { SidebarGroup, SidebarGroupLabel, SidebarMenu } from '@/components/ui/sidebar';

interface SidebarSectionProps {
  title: string;
  children: React.ReactNode;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({ title, children }) => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {children}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default SidebarSection;
