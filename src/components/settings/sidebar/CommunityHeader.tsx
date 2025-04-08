
import React from 'react';

const CommunityHeader: React.FC = () => {
  return (
    <div className="px-3 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-slate-700">
      <h2 className="text-base font-medium flex items-center gap-2">
        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
        Pablo's Community
      </h2>
    </div>
  );
};

export default CommunityHeader;
