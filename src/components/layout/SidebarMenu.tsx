
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  Users, 
  Play, 
  Settings, 
  BookOpen, 
  PlusCircle, 
  Download, 
  BarChart3, 
  MessageSquare, 
  FileText, 
  Layout,
  // Removed the Menu import from lucide-react as it's conflicting
} from 'lucide-react';
import { 
  SidebarHeader, 
  SidebarMenu as SidebarMenuComponent,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarGroupLabel,
  SidebarGroup 
} from '@/components/ui/sidebar';

const SidebarMenuContent: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <>
      <SidebarHeader className="border-b border-nortech-gray-light dark:border-gray-800">
        <Link to="/" className="flex items-center gap-3 pl-2">
          <div className="w-8 h-8 bg-nortech-purple text-white flex items-center justify-center rounded-md font-bold">
            N
          </div>
          <span className="font-semibold text-nortech-dark-blue dark:text-white">Nortech</span>
        </Link>
      </SidebarHeader>
      
      <SidebarGroup>
        <SidebarMenuComponent>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Home"
              isActive={currentPath === '/'}
              asChild
            >
              <Link to="/">
                <Home size={18} />
                <span>Home</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenuComponent>
      </SidebarGroup>
      
      <SidebarSeparator />
      
      <SidebarGroup>
        <SidebarGroupLabel>Get Started</SidebarGroupLabel>
        <SidebarMenuComponent>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Dashboard"
              isActive={currentPath === '/dashboard'}
              asChild
            >
              <Link to="/dashboard">
                <Layout size={18} />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenuComponent>
      </SidebarGroup>
      
      <SidebarSeparator />
      
      <SidebarGroup>
        <SidebarGroupLabel>Spaces</SidebarGroupLabel>
        <SidebarMenuComponent>
          <SidebarMenuItem>
            <SidebarMenuButton 
              tooltip="Create Space"
              asChild
            >
              <Link to="/create-space">
                <PlusCircle size={18} />
                <span>Create Space</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenuComponent>
      </SidebarGroup>
      
      <SidebarSeparator />
      
      <SidebarGroup>
        <SidebarGroupLabel>Content</SidebarGroupLabel>
        <SidebarMenuComponent>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Posts"
              isActive={currentPath === '/posts' || currentPath === '/feed' || currentPath === '/create-post'}
              asChild
            >
              <Link to="/feed">
                <FileText size={18} />
                <span>Posts</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Discussions"
              isActive={currentPath === '/discussions'}
              asChild
            >
              <Link to="/discussions">
                <MessageSquare size={18} />
                <span>Discussions</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Courses"
              isActive={currentPath === '/courses'}
              asChild
            >
              <Link to="/courses">
                <BookOpen size={18} />
                <span>Courses</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Events"
              isActive={currentPath === '/events'}
              asChild
            >
              <Link to="/events">
                <Calendar size={18} />
                <span>Events</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Live Streams"
              isActive={currentPath === '/live-streams'}
              asChild
            >
              <Link to="/live-streams">
                <Play size={18} />
                <span>Live Streams</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenuComponent>
      </SidebarGroup>
      
      <SidebarSeparator />
      
      <SidebarGroup>
        <SidebarGroupLabel>Community</SidebarGroupLabel>
        <SidebarMenuComponent>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Members"
              isActive={currentPath === '/members'}
              asChild
            >
              <Link to="/members">
                <Users size={18} />
                <span>Members</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Analytics"
              isActive={currentPath === '/analytics'}
              asChild
            >
              <Link to="/analytics">
                <BarChart3 size={18} />
                <span>Analytics</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Settings"
              isActive={currentPath.includes('/settings')}
              asChild
            >
              <Link to="/settings">
                <Settings size={18} />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenuComponent>
      </SidebarGroup>
      
      <SidebarSeparator />
      
      <SidebarGroup>
        <SidebarGroupLabel>Links</SidebarGroupLabel>
        <div className="px-4 py-2 text-sm text-nortech-gray-text">
          <div className="flex items-center gap-3 mb-2">
            <Download size={16} />
            <span>Download Android app</span>
          </div>
          <div className="flex items-center gap-3">
            <Download size={16} />
            <span>Download iOS app</span>
          </div>
        </div>
      </SidebarGroup>
    </>
  );
};

export default SidebarMenuContent;
