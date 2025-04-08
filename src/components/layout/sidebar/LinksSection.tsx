
import React from 'react';
import { SidebarGroup, SidebarGroupLabel } from '@/components/ui/sidebar';
import EditableLinks from '../EditableLinks';

const LinksSection: React.FC = () => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Links</SidebarGroupLabel>
      <EditableLinks className="px-4 py-2" />
    </SidebarGroup>
  );
};

export default LinksSection;
