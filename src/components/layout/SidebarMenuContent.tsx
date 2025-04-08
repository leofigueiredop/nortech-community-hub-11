
import React from 'react';
import { 
  SidebarHeader, 
  SidebarSeparator,
  SidebarGroup,
} from '@/components/ui/sidebar';
import { Link } from 'react-router-dom';
import HomeSection from './sidebar/HomeSection';
import GetStartedSection from './sidebar/GetStartedSection';
import SpacesSection from './sidebar/SpacesSection';
import ContentSection from './sidebar/ContentSection';
import CommunitySection from './sidebar/CommunitySection';
import LinksSection from './sidebar/LinksSection';

const SidebarMenuContent: React.FC = () => {
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
        <HomeSection />
      </SidebarGroup>
      
      <SidebarSeparator />
      
      <GetStartedSection />
      
      <SidebarSeparator />
      
      <SpacesSection />
      
      <SidebarSeparator />
      
      <ContentSection />
      
      <SidebarSeparator />
      
      <CommunitySection />
      
      <SidebarSeparator />
      
      <LinksSection />
    </>
  );
};

export default SidebarMenuContent;
