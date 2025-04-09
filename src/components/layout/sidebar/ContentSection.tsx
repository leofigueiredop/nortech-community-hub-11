
import React from 'react';
import { FileText, MessageSquare, Calendar, Terminal, Users, Trophy, Library } from 'lucide-react';
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
        to="/library" 
        icon={<Library size={18} />} 
        label="Content Library" 
      />
      <SidebarLink 
        to="/events" 
        icon={<Calendar size={18} />} 
        label="Events" 
        additionalPaths={['/events/weekly', '/events/calendar']}
      />
      <SidebarLink 
        to="/ai-matchmaker" 
        icon={<Users size={18} />} 
        label="AI Matchmaker" 
      />
      <SidebarLink 
        to="/points" 
        icon={<Trophy size={18} />} 
        label="Points" 
        additionalPaths={['/leaderboard', '/points/store']}
      />
    </SidebarSection>
  );
};

export default ContentSection;
