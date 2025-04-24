
import React from 'react';
import { Rss } from 'lucide-react';
import SidebarLink from './SidebarLink';

const HomeSection: React.FC = () => {
  return (
    <SidebarLink 
      to="/feed" 
      icon={<Rss size={16} className="text-purple-600" />} 
      label="Feed" 
      additionalPaths={["/"]}
    />
  );
};

export default HomeSection;
