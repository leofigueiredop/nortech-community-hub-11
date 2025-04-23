
import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

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
  return (
    <div className="flex items-center group">
      <Link
        to={to}
        className={`flex items-center gap-3 px-3 py-2 rounded-md flex-grow ${
          active 
            ? "bg-purple-100 text-purple-900 dark:bg-purple-900/50 dark:text-purple-100" 
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
        }`}
      >
        <div className="text-gray-500 dark:text-gray-400">{icon}</div>
        <span className="text-sm font-medium">{label}</span>
      </Link>
      
      {onPin && (
        <button 
          onClick={onPin} 
          className="p-1 opacity-0 group-hover:opacity-100 focus:opacity-100 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
          title={isPinned ? "Unpin" : "Pin to favorites"}
        >
          <Star className={`h-4 w-4 ${isPinned ? "fill-amber-400 text-amber-400" : "text-gray-400"}`} />
        </button>
      )}
    </div>
  );
};

export default SettingsMenuItem;
