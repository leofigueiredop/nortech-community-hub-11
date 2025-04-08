
import React from 'react';
import CommunityHeader from './sidebar/CommunityHeader';
import ContentManagementSection from './sidebar/ContentManagementSection';
import MonetizationSection from './sidebar/MonetizationSection';
import TechnicalSection from './sidebar/TechnicalSection';
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

      <div className="py-2">
        <TechnicalSection activeSection={activeSection} />
      </div>
      
      <SectionDivider />
      
      <div className="py-2">
        <ContentManagementSection activeSection={activeSection} />
      </div>
      
      <SectionDivider />
      
      <div className="py-2">
        <MonetizationSection activeSection={activeSection} />
      </div>
      
      <SectionDivider />
      
      <div className="py-2">
        <PreferencesSection activeSection={activeSection} />
      </div>
      
      <SectionDivider />
      
      <div className="py-2">
        <MemberActionsSection activeSection={activeSection} />
      </div>
    </div>
  );
};

export default SettingsSidebar;
