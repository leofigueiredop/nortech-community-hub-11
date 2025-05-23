
import React from 'react';
import { ContentProgress } from '@/types/library';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle, Circle, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ContentProgressItemProps {
  progress: ContentProgress;
  contentTitle: string;
}

export const ContentProgressItem: React.FC<ContentProgressItemProps> = ({
  progress,
  contentTitle,
}) => {
  // Use correct property names from ContentProgress interface
  const isCompleted = progress.completed_at !== null;
  const progressPercent = progress.progress_percent || 0;
  const lastAccessed = progress.last_accessed_at;
  const pointsAwarded = progress.points_awarded;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 border rounded-md bg-card hover:bg-accent/50 transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          {isCompleted ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <Circle className="h-4 w-4 text-muted-foreground" />
          )}
          <h4 className="font-medium text-sm">{contentTitle}</h4>
        </div>
        
        <div className="flex items-center text-xs text-muted-foreground mb-2">
          <Clock className="h-3 w-3 mr-1" />
          <span>
            Last accessed {formatDistanceToNow(new Date(lastAccessed))} ago
          </span>
          {pointsAwarded && (
            <span className="ml-2 bg-primary/10 text-primary px-1.5 rounded text-[10px] font-medium">
              Points Awarded
            </span>
          )}
        </div>
        
        <Progress value={progressPercent} className="h-1.5" />
      </div>
    </div>
  );
};

interface ContentProgressListProps {
  progressItems: ContentProgress[];
  getContentTitle: (contentId: string) => string;
}

export const ContentProgressList: React.FC<ContentProgressListProps> = ({
  progressItems,
  getContentTitle,
}) => {
  if (progressItems.length === 0) {
    return (
      <div className="text-center py-8 px-4">
        <p className="text-muted-foreground">No content progress yet</p>
      </div>
    );
  }

  const sortedItems = [...progressItems].sort(
    (a, b) => new Date(b.last_accessed_at).getTime() - 
              new Date(a.last_accessed_at).getTime()
  );

  return (
    <div className="space-y-2">
      {sortedItems.map((item) => (
        <ContentProgressItem 
          key={item.id} 
          progress={item} 
          contentTitle={getContentTitle(item.content_id)}
        />
      ))}
    </div>
  );
};

export default ContentProgressList;
