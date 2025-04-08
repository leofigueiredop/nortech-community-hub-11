
import React from 'react';
import { Home } from 'lucide-react';
import SidebarLink from './SidebarLink';

const HomeSection: React.FC = () => {
  return (
    <SidebarLink 
      to="/" 
      icon={<Home size={18} className="text-purple-600" />} 
      label="Home" 
      matchExact={true}
    />
  );
};

export default HomeSection;
