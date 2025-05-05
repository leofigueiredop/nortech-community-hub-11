import React from 'react';
import { SidebarGroup } from '@/components/ui/sidebar';
import EditableLinks from '../EditableLinks';

const LinksSection: React.FC = () => {
  return (
    <SidebarGroup>
      <EditableLinks className="px-4 py-2" />
    </SidebarGroup>
  );
};

export default LinksSection;
