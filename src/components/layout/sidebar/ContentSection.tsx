
import React from 'react';
import { FileText, MessageSquare, Calendar, Terminal, Users, Trophy, Library, PlusCircle } from 'lucide-react';
import SidebarSection from './SidebarSection';
import SidebarLink from './SidebarLink';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';

const ContentSection: React.FC = () => {
  return (
    <SidebarSection title="Content">
      <div className="flex items-center justify-between mb-2 px-2">
        <span className="text-xs text-gray-500 dark:text-gray-400">Manage</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <PlusCircle size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <a href="/create-post">Create Post</a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/create-space">Create Space</a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/events/create">Create Event</a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
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
