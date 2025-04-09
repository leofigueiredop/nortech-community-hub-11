
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface ContentProgressProps {
  progress: number;
  showProgress: boolean;
}

const ContentProgress: React.FC<ContentProgressProps> = ({ progress, showProgress }) => {
  if (!showProgress) return null;
  
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-muted-foreground">Progress</span>
        <span className="font-medium">{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};

export default ContentProgress;
