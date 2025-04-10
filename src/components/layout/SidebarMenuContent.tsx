
import React from 'react';
import ContentSection from './sidebar/ContentSection';
import SpacesSection from './sidebar/SpacesSection';
import CommunitySection from './sidebar/CommunitySection';
import LinksSection from './sidebar/LinksSection';
import GetStartedSection from './sidebar/GetStartedSection';

const SidebarMenuContent = () => {
  return (
    <div className="py-4 flex flex-col h-full">
      <SpacesSection />
      <ContentSection />
      <CommunitySection />
      <LinksSection />
      <div className="mt-auto">
        <GetStartedSection />
      </div>
    </div>
  );
};

export default SidebarMenuContent;
