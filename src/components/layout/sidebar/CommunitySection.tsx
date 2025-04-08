
import React from 'react';
import { Users, BarChart3, Settings } from 'lucide-react';
import SidebarSection from './SidebarSection';
import SidebarLink from './SidebarLink';

const CommunitySection: React.FC = () => {
  return (
    <SidebarSection title="Community">
      <SidebarLink 
        to="/members" 
        icon={<Users size={18} />} 
        label="Members" 
      />
      <SidebarLink 
        to="/analytics" 
        icon={<BarChart3 size={18} />} 
        label="Analytics" 
      />
      <SidebarLink 
        to="/settings" 
        icon={<Settings size={18} />} 
        label="Settings" 
        additionalPaths={['/settings/']}
      />
    </SidebarSection>
  );
};

export default CommunitySection;
