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
import { useTranslation } from 'react-i18next';

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
    // @ts-expect-error: Type instantiation is excessively deep and possibly infinite.
  const { t } = useTranslation('navigation');

  // Translation variables
  // @ts-expect-error: i18next type inference issue
  const homeLabel = t('main.home') as string;
  // @ts-expect-error: i18next type inference issue
  const dashboardLabel = t('main.dashboard') as string;
  // @ts-expect-error: i18next type inference issue
  const createSpaceLabel = t('main.createSpace') as string;
  // @ts-expect-error: i18next type inference issue
  const postsLabel = t('main.posts') as string;
  // @ts-expect-error: i18next type inference issue
  const discussionsLabel = t('main.discussions') as string;
  // @ts-expect-error: i18next type inference issue
  const coursesLabel = t('main.courses') as string;
  // @ts-expect-error: i18next type inference issue
  const eventsLabel = t('main.events') as string;
  // @ts-expect-error: i18next type inference issue
  const liveStreamsLabel = t('main.liveStreams') as string;
  // @ts-expect-error: i18next type inference issue
  const membersLabel = t('main.members') as string;
  // @ts-expect-error: i18next type inference issue
  const analyticsLabel = t('main.analytics') as string;
  // @ts-expect-error: i18next type inference issue
  const settingsLabel = t('main.settings') as string;
  // @ts-expect-error: i18next type inference issue
  const getStartedTitle = t('section.getStarted') as string;
  // @ts-expect-error: i18next type inference issue
  const spacesTitle = t('section.spaces') as string;
  // @ts-expect-error: i18next type inference issue
  const contentTitle = t('section.content') as string;
  // @ts-expect-error: i18next type inference issue
  const communityTitle = t('section.community') as string;
  // @ts-expect-error: i18next type inference issue
  const linksTitle = t('section.links') as string;
  // @ts-expect-error: i18next type inference issue
  const downloadAndroid = t('download.android') as string;
  // @ts-expect-error: i18next type inference issue
  const downloadIos = t('download.ios') as string;

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
          label={homeLabel} 
          to="/" 
          active={true} 
        />
        
        <SectionTitle title={getStartedTitle} />
        <SidebarLink 
          icon={<Layout size={18} />} 
          label={dashboardLabel} 
          to="/dashboard" 
        />
        
        <SectionTitle title={spacesTitle} />
        <SidebarLink 
          icon={<PlusCircle size={18} />} 
          label={createSpaceLabel} 
          to="/create-space" 
        />
        
        <SectionTitle title={contentTitle} />
        <SidebarLink 
          icon={<FileText size={18} />} 
          label={postsLabel} 
          to="/posts" 
        />
        <SidebarLink 
          icon={<MessageSquare size={18} />} 
          label={discussionsLabel} 
          to="/discussions" 
        />
        <SidebarLink 
          icon={<BookOpen size={18} />} 
          label={coursesLabel} 
          to="/courses" 
        />
        <SidebarLink 
          icon={<Calendar size={18} />} 
          label={eventsLabel} 
          to="/events" 
        />
        <SidebarLink 
          icon={<Play size={18} />} 
          label={liveStreamsLabel} 
          to="/live-streams" 
        />
        
        <SectionTitle title={communityTitle} />
        <SidebarLink 
          icon={<Users size={18} />} 
          label={membersLabel} 
          to="/members" 
        />
        <SidebarLink 
          icon={<BarChart3 size={18} />} 
          label={analyticsLabel} 
          to="/analytics" 
        />
        <SidebarLink 
          icon={<Settings size={18} />} 
          label={settingsLabel} 
          to="/settings" 
        />
        
        <SectionTitle title={linksTitle} />
        <div className="px-4 py-2">
          <div className="flex items-center text-sm text-nortech-gray-text gap-3 mb-2">
            <Download size={16} />
            <span>{downloadAndroid}</span>
          </div>
          <div className="flex items-center text-sm text-nortech-gray-text gap-3">
            <Download size={16} />
            <span>{downloadIos}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
