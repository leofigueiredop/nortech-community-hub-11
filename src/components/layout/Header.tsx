
// Instead of modifying the Header component directly, we'll create a wrapper for the points badge that can be used in the header

import React from 'react';
import PointsBadge from '@/components/points/PointsBadge';

export const HeaderPointsBadge: React.FC = () => {
  return (
    <div className="mr-2">
      <PointsBadge size="sm" />
    </div>
  );
};
