
import React from 'react';
import { 
  SidebarHeader, 
  SidebarSeparator,
  SidebarGroup,
} from '@/components/ui/sidebar';
import { Link } from 'react-router-dom';
import HomeSection from './sidebar/HomeSection';
import GetStartedSection from './sidebar/GetStartedSection';
import ContentSection from './sidebar/ContentSection';
import CommunitySection from './sidebar/CommunitySection';
import LinksSection from './sidebar/LinksSection';
import { Trophy } from 'lucide-react';

const SidebarMenuContent: React.FC = () => {
  return (
    <>
      <SidebarHeader className="border-b border-nortech-gray-light dark:border-gray-800 px-3 py-4">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center rounded-lg font-bold transform transition-all duration-200 group-hover:scale-110 shadow-md">
            N
          </div>
          <span className="font-semibold text-xl bg-gradient-to-r from-purple-700 to-indigo-700 bg-clip-text text-transparent">Nortech</span>
        </Link>
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
        
        <div className="mb-3">
          <h3 className="px-3 mb-2 text-xs font-medium text-muted-foreground uppercase">Points & Rewards</h3>
          <div className="space-y-1">
            <Link
              to="/points"
              className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
            >
              <Trophy size={16} className="text-purple-500" />
              <span>Points Dashboard</span>
            </Link>
            <Link
              to="/points/store"
              className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-purple-500">
                <path d="M20.59 13.41L19.17 12L20.59 10.59C21.37 9.81 21.37 8.56 20.59 7.78L16.22 3.41C15.44 2.63 14.19 2.63 13.41 3.41L12 4.83L10.59 3.41C9.81 2.63 8.56 2.63 7.78 3.41L3.41 7.78C2.63 8.56 2.63 9.81 3.41 10.59L4.83 12L3.41 13.41C2.63 14.19 2.63 15.44 3.41 16.22L7.78 20.59C8.56 21.37 9.81 21.37 10.59 20.59L12 19.17L13.41 20.59C14.19 21.37 15.44 21.37 16.22 20.59L20.59 16.22C21.37 15.44 21.37 14.19 20.59 13.41ZM14.83 19.17L12 16.34L9.17 19.17L4.83 14.83L7.66 12L4.83 9.17L9.17 4.83L12 7.66L14.83 4.83L19.17 9.17L16.34 12L19.17 14.83L14.83 19.17Z" fill="currentColor"/>
              </svg>
              <span>Rewards Store</span>
            </Link>
            <Link
              to="/leaderboard"
              className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-purple-500">
                <path d="M17 10.5V7C17 6.45 16.55 6 16 6H14V3.5C14 2.95 13.55 2.5 13 2.5H11C10.45 2.5 10 2.95 10 3.5V6H8C7.45 6 7 6.45 7 7V10.5C7 11.05 7.45 11.5 8 11.5H10V15H8C7.45 15 7 15.45 7 16V19.5C7 20.05 7.45 20.5 8 20.5H16C16.55 20.5 17 20.05 17 19.5V16C17 15.45 16.55 15 16 15H14V11.5H16C16.55 11.5 17 11.05 17 10.5ZM21 18H19V21.5H17.5V18H16V16.5H21V18ZM5 16.5V18H3V21.5H1.5V18H0V16.5H5Z" fill="currentColor"/>
              </svg>
              <span>Leaderboard</span>
            </Link>
          </div>
        </div>
        
        <SidebarSeparator className="my-3 bg-gradient-to-r from-transparent via-purple-200 dark:via-purple-900 to-transparent h-px" />
        
        <LinksSection />
      </div>
    </>
  );
};

export default SidebarMenuContent;
