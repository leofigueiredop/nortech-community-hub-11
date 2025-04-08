
import React from 'react';

const CommunityHeader: React.FC = () => {
  return (
    <div className="p-4 mb-2">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        Pablo's Community <span className="text-xs text-gray-400">▼</span>
      </h2>
    </div>
  );
};

export default CommunityHeader;
