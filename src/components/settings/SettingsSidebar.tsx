
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
    <div className="w-64 h-full bg-gray-900 text-white overflow-y-auto">
      <CommunityHeader />

      <TechnicalSection activeSection={activeSection} />
      
      <SectionDivider />
      
      <ContentManagementSection activeSection={activeSection} />
      
      <SectionDivider />
      
      <MonetizationSection activeSection={activeSection} />
      
      <SectionDivider />
      
      <PreferencesSection activeSection={activeSection} />
      
      <SectionDivider />
      
      <MemberActionsSection activeSection={activeSection} />
    </div>
  );
};

export default SettingsSidebar;
