
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Trophy } from 'lucide-react';

interface ContentProgressProps {
  progress: number;
  showProgress: boolean;
}

const ContentProgress: React.FC<ContentProgressProps> = ({ progress, showProgress }) => {
  if (!showProgress) return null;
  
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-muted-foreground flex items-center">
          <Trophy className="h-3 w-3 mr-1" /> Progress
        </span>
        <span className="font-medium">
          {progress < 100 
            ? `${progress}% complete` 
            : 'Completed!'}
        </span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};

export default ContentProgress;
