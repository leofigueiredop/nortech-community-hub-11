
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  matchExact?: boolean;
  additionalPaths?: string[];
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, label, matchExact = false, additionalPaths = [] }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { isMobile } = useIsMobile();
  
  const isActive = matchExact 
    ? currentPath === to 
    : currentPath === to || additionalPaths.some(path => currentPath === path || currentPath.startsWith(path));

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        tooltip={isMobile ? undefined : label}
        isActive={isActive}
        asChild
        className="transition-all duration-200 hover:translate-x-1"
      >
        <Link to={to} className="w-full">
          <span className="flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-md h-6 w-6 mr-2 transition-colors">
            {icon}
          </span>
          <span className="flex-1 text-xs font-normal">{label}</span>
          {isActive && (
            <span className="h-full w-1 bg-purple-500 absolute -left-2 rounded-r-md" />
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export default SidebarLink;
