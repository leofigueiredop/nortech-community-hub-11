
import React from 'react';
import { usePoints } from '@/context/PointsContext';
import { Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface PointsBadgeProps {
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const PointsBadge: React.FC<PointsBadgeProps> = ({ 
  showIcon = true, 
  size = 'md' 
}) => {
  const { totalPoints, getUserLevel } = usePoints();
  const { level } = getUserLevel();
  
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2 py-0.5';
      case 'lg':
        return 'text-sm px-3 py-1';
      default:
        return 'text-xs px-2.5 py-0.5';
    }
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant="secondary" 
            className={`bg-nortech-purple/10 text-nortech-purple hover:bg-nortech-purple/20 ${getSizeClasses()} flex items-center gap-1`}
          >
            {showIcon && <Trophy className="w-3 h-3" />}
            <span>Level {level}</span>
            <span className="font-semibold">{totalPoints} pts</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>Your current points and level</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default PointsBadge;
