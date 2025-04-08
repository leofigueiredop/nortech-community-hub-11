
import React from 'react';
import { Link } from 'react-router-dom';
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
  Layout
} from 'lucide-react';

interface SidebarLinkProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active?: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ icon, label, to, active }) => {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 ${
        active 
          ? "bg-nortech-purple text-white rounded-lg" 
          : "text-nortech-gray-text hover:bg-nortech-light-purple hover:text-nortech-purple rounded-lg transition-colors"
      }`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
};

interface SectionTitleProps {
  title: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title }) => {
  return (
    <h3 className="px-4 mb-2 mt-6 text-xs uppercase font-semibold text-nortech-gray-text">
      {title}
    </h3>
  );
};

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 border-r border-nortech-gray-light h-screen flex flex-col bg-white dark:bg-nortech-dark-bg dark:border-gray-800">
      <div className="h-16 flex items-center px-6 border-b border-nortech-gray-light dark:border-gray-800">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-nortech-purple text-white flex items-center justify-center rounded-md font-bold">
            N
          </div>
          <span className="font-semibold text-nortech-dark-blue dark:text-white">Nortech</span>
        </Link>
      </div>
      
      <div className="flex-1 overflow-auto px-3 py-4">
        <SidebarLink 
          icon={<Home size={18} />} 
          label="Home" 
          to="/" 
          active={true} 
        />
        
        <SectionTitle title="Get Started" />
        <SidebarLink 
          icon={<Layout size={18} />} 
          label="Dashboard" 
          to="/dashboard" 
        />
        
        <SectionTitle title="Spaces" />
        <SidebarLink 
          icon={<PlusCircle size={18} />} 
          label="Create Space" 
          to="/create-space" 
        />
        
        <SectionTitle title="Content" />
        <SidebarLink 
          icon={<FileText size={18} />} 
          label="Posts" 
          to="/posts" 
        />
        <SidebarLink 
          icon={<MessageSquare size={18} />} 
          label="Discussions" 
          to="/discussions" 
        />
        <SidebarLink 
          icon={<BookOpen size={18} />} 
          label="Courses" 
          to="/courses" 
        />
        <SidebarLink 
          icon={<Calendar size={18} />} 
          label="Events" 
          to="/events" 
        />
        <SidebarLink 
          icon={<Play size={18} />} 
          label="Live Streams" 
          to="/live-streams" 
        />
        
        <SectionTitle title="Community" />
        <SidebarLink 
          icon={<Users size={18} />} 
          label="Members" 
          to="/members" 
        />
        <SidebarLink 
          icon={<BarChart3 size={18} />} 
          label="Analytics" 
          to="/analytics" 
        />
        <SidebarLink 
          icon={<Settings size={18} />} 
          label="Settings" 
          to="/settings" 
        />
        
        <SectionTitle title="Links" />
        <div className="px-4 py-2">
          <div className="flex items-center text-sm text-nortech-gray-text gap-3 mb-2">
            <Download size={16} />
            <span>Download Android app</span>
          </div>
          <div className="flex items-center text-sm text-nortech-gray-text gap-3">
            <Download size={16} />
            <span>Download iOS app</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
