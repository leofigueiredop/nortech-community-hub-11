
import React from 'react';
import { Home, Grid3X3, Compass, Bell, BookOpen, Rss, Zap } from 'lucide-react';
import SidebarSection from './SidebarSection';
import SidebarLink from './SidebarLink';

const HomeSection: React.FC = () => {
  return (
    <SidebarSection title="Home">
      <SidebarLink 
        to="/" 
        icon={<Home size={18} />} 
        label="Dashboard" 
        additionalPaths={['/home']}
      />
      <SidebarLink 
        to="/explore" 
        icon={<Compass size={18} />} 
        label="Explore"
      />
      <SidebarLink 
        to="/spaces" 
        icon={<Grid3X3 size={18} />} 
        label="Spaces"
      />
      <SidebarLink 
        to="/feed" 
        icon={<Rss size={18} />} 
        label="Feed"
      />
      <SidebarLink 
        to="/learning" 
        icon={<BookOpen size={18} />} 
        label="Learning Path"
      />
      <SidebarLink 
        to="/notifications" 
        icon={<Bell size={18} />} 
        label="Notifications"
      />
      <SidebarLink 
        to="/activity" 
        icon={<Zap size={18} />} 
        label="Activity"
      />
    </SidebarSection>
  );
};

export default HomeSection;
