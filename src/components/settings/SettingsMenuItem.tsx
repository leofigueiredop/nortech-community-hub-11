
import React from 'react';
import { Link } from 'react-router-dom';

export interface SettingsMenuItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active?: boolean;
  badge?: string;
}

const SettingsMenuItem: React.FC<SettingsMenuItemProps> = ({ 
  icon, 
  label, 
  to, 
  active = false,
  badge
}) => {
  return (
    <Link 
      to={to} 
      className={`
        flex items-center justify-between px-3 py-2 rounded-md text-sm
        ${active 
          ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white' 
          : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800/50'}
      `}
    >
      <div className="flex items-center">
        <span className="mr-3">{icon}</span>
        <span>{label}</span>
      </div>
      
      {badge && (
        <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </Link>
  );
};

export default SettingsMenuItem;
