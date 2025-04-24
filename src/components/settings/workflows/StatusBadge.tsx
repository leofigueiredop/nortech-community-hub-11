
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Circle, CircleCheck, CirclePause } from 'lucide-react';

type StatusType = 'active' | 'paused' | 'coming-soon';

interface StatusBadgeProps {
  status: StatusType;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'active':
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-0 flex items-center gap-1">
          <CircleCheck className="h-3.5 w-3.5" />
          <span>Active</span>
        </Badge>
      );
    case 'paused':
      return (
        <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-0 flex items-center gap-1">
          <CirclePause className="h-3.5 w-3.5" />
          <span>Paused</span>
        </Badge>
      );
    case 'coming-soon':
      return (
        <Badge className="bg-gray-100 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400 border-0 flex items-center gap-1">
          <Circle className="h-3.5 w-3.5" />
          <span>Coming Soon</span>
        </Badge>
      );
    default:
      return null;
  }
};

export default StatusBadge;
