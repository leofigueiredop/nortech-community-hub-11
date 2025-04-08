
import React from 'react';
import { Link } from 'react-router-dom';

interface SettingsMenuItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active?: boolean;
}

const SettingsMenuItem: React.FC<SettingsMenuItemProps> = ({ icon, label, to, active }) => {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 ${
        active 
          ? "bg-gray-800 text-white rounded-md" 
          : "text-gray-300 hover:bg-gray-800 hover:text-white hover:rounded-md transition-colors"
      }`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
};

export default SettingsMenuItem;
