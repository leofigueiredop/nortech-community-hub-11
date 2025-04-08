
import React from 'react';
import { PlusCircle } from 'lucide-react';
import SidebarSection from './SidebarSection';
import SidebarLink from './SidebarLink';

const SpacesSection: React.FC = () => {
  return (
    <SidebarSection title="Spaces">
      <SidebarLink 
        to="/create-space" 
        icon={<PlusCircle size={18} />} 
        label="Create Space" 
      />
    </SidebarSection>
  );
};

export default SpacesSection;
