
import React from 'react';
import { 
  SidebarHeader, 
  SidebarSeparator,
  SidebarGroup,
} from '@/components/ui/sidebar';
import { CommunitySwitcher } from '@/components/community/CommunitySwitcher';
import HomeSection from './sidebar/HomeSection';
import GetStartedSection from './sidebar/GetStartedSection';
import ContentSection from './sidebar/ContentSection';
import CommunitySection from './sidebar/CommunitySection';
import LinksSection from './sidebar/LinksSection';
import { useTranslation } from 'react-i18next';

const SidebarMenuContent: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <>
      <SidebarHeader className="border-b border-nortech-gray-light dark:border-gray-800 px-3 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 group relative">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center rounded-lg font-bold transform transition-all duration-200 group-hover:scale-110 shadow-md relative">
            <span>N</span>
            <div className="absolute -top-1 -right-1">
              <CommunitySwitcher />
            </div>
          </div>
          <span className="font-semibold text-xl bg-gradient-to-r from-purple-700 to-indigo-700 bg-clip-text text-transparent">
            Nortech
          </span>
        </div>
      </SidebarHeader>
      
      <div className="p-3 mt-2">
        <SidebarGroup>
          <HomeSection />
        </SidebarGroup>
        
        <SidebarSeparator className="my-3 bg-gradient-to-r from-transparent via-purple-200 dark:via-purple-900 to-transparent h-px" />
        
        <GetStartedSection />
        
        <SidebarSeparator className="my-3 bg-gradient-to-r from-transparent via-purple-200 dark:via-purple-900 to-transparent h-px" />
        
        <ContentSection />
        
        <SidebarSeparator className="my-3 bg-gradient-to-r from-transparent via-purple-200 dark:via-purple-900 to-transparent h-px" />
        
        <CommunitySection />

        <SidebarSeparator className="my-3 bg-gradient-to-r from-transparent via-purple-200 dark:via-purple-900 to-transparent h-px" />
        
        <LinksSection />
      </div>
    </>
  );
};

export default SidebarMenuContent;
