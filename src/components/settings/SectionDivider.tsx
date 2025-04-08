
import React from 'react';

interface SectionDividerProps {
  label?: string;
}

const SectionDivider: React.FC<SectionDividerProps> = ({ label }) => {
  if (label) {
    return (
      <div className="flex items-center my-6 px-4">
        <div className="h-px bg-gray-300 dark:bg-gray-700 flex-grow"></div>
        <span className="px-4 text-sm font-medium text-gray-500 dark:text-gray-400">{label}</span>
        <div className="h-px bg-gray-300 dark:bg-gray-700 flex-grow"></div>
      </div>
    );
  }
  
  return <div className="h-px bg-gray-300 dark:bg-gray-700 my-4 mx-4"></div>;
};

export default SectionDivider;
