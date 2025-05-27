import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface SettingsMenuItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active?: boolean;
  isPinned?: boolean;
  onPin?: () => void;
}

const SettingsMenuItem: React.FC<SettingsMenuItemProps> = ({ 
  icon, 
  label, 
  to, 
  active = false,
  isPinned = false,
  onPin
}) => {
  const { colors } = useTheme();
  
  // Dynamically calculate background color with opacity for active items
  const getActiveBackgroundColor = () => {
    const hex = colors.primaryColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgba(${r}, ${g}, ${b}, 0.15)`;
  };
  
  return (
    <div className="flex items-center group">
      <Link
        to={to}
        className={`flex items-center gap-3 px-3 py-2 rounded-md flex-grow ${
          active 
            ? "text-primary" 
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
        }`}
        style={active ? {
          backgroundColor: getActiveBackgroundColor(),
          color: colors.primaryColor
        } : undefined}
      >
        <div className={active ? "text-primary" : "text-gray-500 dark:text-gray-400"}>
          {icon}
        </div>
        <span className="text-sm font-medium">{label}</span>
      </Link>
      
      {onPin && (
        <button 
          onClick={onPin} 
          className="p-1 opacity-0 group-hover:opacity-100 focus:opacity-100 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
          title={isPinned ? "Unpin" : "Pin to favorites"}
        >
          <Star 
            className={`h-4 w-4 ${isPinned ? "text-primary" : "text-gray-400"}`} 
            style={isPinned ? {
              fill: colors.primaryColor,
              color: colors.primaryColor
            } : undefined}
          />
        </button>
      )}
    </div>
  );
};

export default SettingsMenuItem;
