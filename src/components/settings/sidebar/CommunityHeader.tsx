
import React from 'react';

const CommunityHeader: React.FC = () => {
  return (
    <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800">
      <h2 className="text-sm font-medium flex items-center gap-2">
        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
        Nortech Settings
      </h2>
    </div>
  );
};

export default CommunityHeader;
