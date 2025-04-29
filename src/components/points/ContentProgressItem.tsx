
import React from 'react';
import { ContentProgress } from '@/types/library';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { Check, Clock } from 'lucide-react';

export interface ContentProgressItemProps {
  progress: ContentProgress;
  contentTitle: string;
}

const ContentProgressItem: React.FC<ContentProgressItemProps> = ({
  progress,
  contentTitle
}) => {
  const isCompleted = progress.completed_at !== null;
  const percentComplete = progress.progress_percent;
  const lastAccessed = new Date(progress.last_accessed_at);
  
  return (
    <div className="flex flex-col p-3 border rounded-md hover:bg-accent/5 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium line-clamp-1">{contentTitle}</h4>
        {isCompleted ? (
          <span className="text-green-600 dark:text-green-400 flex items-center gap-1 text-sm">
            <Check size={14} />
            Complete
          </span>
        ) : (
          <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1 text-sm">
            <Clock size={14} />
            In progress
          </span>
        )}
      </div>
      
      <div className="space-y-2">
        <Progress value={percentComplete} className="h-2" />
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{percentComplete}% complete</span>
          <span>Last viewed {format(lastAccessed, 'MMM d, yyyy')}</span>
        </div>
      </div>
    </div>
  );
};

export default ContentProgressItem;
