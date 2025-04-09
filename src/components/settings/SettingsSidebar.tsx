
import React from 'react';
import CommunityHeader from './sidebar/CommunityHeader';
import TechnicalSection from './sidebar/TechnicalSection';
import ContentManagementSection from './sidebar/ContentManagementSection';
import MonetizationSection from './sidebar/MonetizationSection';
import PreferencesSection from './sidebar/PreferencesSection';
import MemberActionsSection from './sidebar/MemberActionsSection';
import SectionDivider from './SectionDivider';

interface SettingsSidebarProps {
  activeSection?: string;
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ activeSection = "general" }) => {
  return (
    <div className="w-full h-full bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-white overflow-y-auto">
      <CommunityHeader />

      <div className="pt-2">
        <div className="px-3 pb-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
          COMMUNITY MANAGEMENT
        </div>
        <TechnicalSection activeSection={activeSection} />
      </div>
      
      <SectionDivider />
      
      <div className="pt-2">
        <div className="px-3 pb-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
          CONTENT MANAGEMENT
        </div>
        <ContentManagementSection activeSection={activeSection} />
      </div>
      
      <SectionDivider />
      
      <div className="pt-2">
        <div className="px-3 pb-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
          MONETIZATION
        </div>
        <MonetizationSection activeSection={activeSection} />
      </div>
      
      <SectionDivider />
      
      <div className="pt-2">
        <div className="px-3 pb-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
          COMMUNITY PREFERENCES
        </div>
        <PreferencesSection activeSection={activeSection} />
      </div>
      
      <SectionDivider />
      
      <div className="pt-2">
        <div className="px-3 pb-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
          MEMBER EXPERIENCE
        </div>
        <MemberActionsSection activeSection={activeSection} />
      </div>
    </div>
  );
};

export default SettingsSidebar;
