
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';

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
  
  const isActive = matchExact 
    ? currentPath === to 
    : currentPath === to || additionalPaths.some(path => currentPath === path || currentPath.startsWith(path));

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        tooltip={label}
        isActive={isActive}
        asChild
      >
        <Link to={to}>
          {icon}
          <span>{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export default SidebarLink;
