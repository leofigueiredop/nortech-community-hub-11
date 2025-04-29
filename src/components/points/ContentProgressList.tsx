
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { ContentProgress } from '@/types/library';

export interface ContentProgressListProps {
  progressItems: ContentProgress[];
  getContentTitle: (id: string) => string;
}

const ContentProgressList: React.FC<ContentProgressListProps> = ({ 
  progressItems, 
  getContentTitle 
}) => {
  // Sort items by last accessed date (most recent first)
  const sortedItems = [...progressItems].sort((a, b) => 
    new Date(b.lastAccessedAt || b.last_accessed_at).getTime() - 
    new Date(a.lastAccessedAt || a.last_accessed_at).getTime()
  );

  if (sortedItems.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>You haven't started any content yet.</p>
        <p className="mt-2">Explore the library to find interesting content!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedItems.map((item) => {
        const isCompleted = item.completed || item.completed_at !== null;
        const progressValue = item.progress || item.progress_percent || 0;
        
        return (
          <div key={item.id} className="bg-card p-4 rounded-lg border">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium truncate">{getContentTitle(item.contentId || item.content_id)}</h3>
              {isCompleted ? (
                <Badge variant="default" className="bg-green-500 text-white hover:bg-green-600">
                  Completed
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-300">
                  In Progress
                </Badge>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{progressValue}%</span>
              </div>
              <Progress value={progressValue} className="h-2" />
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs text-muted-foreground">
                  Last accessed: {new Date(item.lastAccessedAt || item.last_accessed_at).toLocaleDateString()}
                </span>
                <Button variant="ghost" size="sm" className="text-xs h-7 px-2.5">
                  Resume <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ContentProgressList;
