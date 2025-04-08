
import React from 'react';
import { FileText, MessageSquare, BookOpen, Calendar, Play } from 'lucide-react';
import SidebarSection from './SidebarSection';
import SidebarLink from './SidebarLink';

const ContentSection: React.FC = () => {
  return (
    <SidebarSection title="Content">
      <SidebarLink 
        to="/feed" 
        icon={<FileText size={18} />} 
        label="Posts" 
        additionalPaths={['/create-post']}
      />
      <SidebarLink 
        to="/discussions" 
        icon={<MessageSquare size={18} />} 
        label="Discussions" 
      />
      <SidebarLink 
        to="/courses" 
        icon={<BookOpen size={18} />} 
        label="Courses" 
      />
      <SidebarLink 
        to="/events" 
        icon={<Calendar size={18} />} 
        label="Events" 
      />
      <SidebarLink 
        to="/live-streams" 
        icon={<Play size={18} />} 
        label="Live Streams" 
      />
    </SidebarSection>
  );
};

export default ContentSection;
