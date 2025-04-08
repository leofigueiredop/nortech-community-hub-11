
import React from 'react';
import { Layout } from 'lucide-react';
import SidebarSection from './SidebarSection';
import SidebarLink from './SidebarLink';

const GetStartedSection: React.FC = () => {
  return (
    <SidebarSection title="Get Started">
      <SidebarLink 
        to="/dashboard" 
        icon={<Layout size={18} />} 
        label="Dashboard" 
      />
    </SidebarSection>
  );
};

export default GetStartedSection;
