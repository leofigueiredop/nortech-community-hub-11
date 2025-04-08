
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
        flex items-center justify-between px-3 py-1.5 my-0.5 text-sm rounded-md
        ${active 
          ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 font-medium' 
          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700/50'}
      `}
    >
      <div className="flex items-center gap-2">
        <span className={`${active ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}>
          {icon}
        </span>
        <span>{label}</span>
      </div>
      
      {badge && (
        <span className="text-xs bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300 px-1.5 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </Link>
  );
};

export default SettingsMenuItem;
