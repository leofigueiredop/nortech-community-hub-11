
import React from 'react';
import { Button } from '@/components/ui/button';
import { ContentItem } from '@/types/library';
import { formatDuration } from '../viewer/contentViewerUtils';
import { Play, FileText, Book, Play as PlayIcon, Bookmark, CheckCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useContentProgress } from '@/hooks/useContentProgress';

interface ContentFreeOverlayProps {
  item: ContentItem;
}

const ContentFreeOverlay: React.FC<ContentFreeOverlayProps> = ({ item }) => {
  const { getProgress } = useContentProgress();
  const progress = getProgress(item.id);
  const isCompleted = progress?.completed || false;
  const progressPercentage = progress ? progress.progress : 0;

  const getActionIcon = () => {
    switch (item.format) {
      case 'video':
      case 'youtube':
      case 'vimeo':
        return <Play className="h-4 w-4" fill="currentColor" />;
      case 'pdf':
      case 'text':
        return <FileText className="h-4 w-4" />;
      case 'course':
        return <Book className="h-4 w-4" />;
      default:
        return <PlayIcon className="h-4 w-4" />;
    }
  };

  const getActionText = () => {
    switch (item.format) {
      case 'video':
      case 'youtube':
      case 'vimeo':
        return 'Watch Now';
      case 'pdf':
      case 'text':
        return 'Read Now';
      case 'audio':
        return 'Listen Now';
      case 'course':
        return 'Start Course';
      case 'link':
        return 'Visit Link';
      default:
        return 'View Now';
    }
  };

  return (
    <div className="absolute inset-0 bg-card/95 flex flex-col p-4 z-10 animate-fade-in overflow-y-auto">
      <div className="flex-1 flex flex-col space-y-2">
        {/* Title */}
        <h3 className="text-sm font-semibold line-clamp-1">{item.title}</h3>
        
        {/* Description */}
        <p className="text-xs text-muted-foreground line-clamp-3">{item.description}</p>
        
        {/* Duration info if available */}
        {item.duration > 0 && (
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            <span>{formatDuration(item.duration)}</span>
          </div>
        )}
        
        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-auto">
            {item.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs text-foreground/70">
                {tag}
              </Badge>
            ))}
            {item.tags.length > 3 && (
              <span className="text-xs text-muted-foreground">+{item.tags.length - 3}</span>
            )}
          </div>
        )}
      </div>
      
      {/* Progress bar */}
      {progress && progressPercentage > 0 && !isCompleted && (
        <div className="w-full h-1 bg-muted rounded-full mt-4">
          <div 
            className="h-full bg-primary rounded-full" 
            style={{ width: `${progressPercentage}%` }} 
          />
          <div className="text-xs text-muted-foreground mt-1">
            {progressPercentage}% {item.format === 'video' ? 'watched' : 'completed'}
          </div>
        </div>
      )}
      
      {/* Completed indicator */}
      {isCompleted && (
        <div className="text-xs text-green-500 flex items-center mt-4">
          <CheckCircle className="h-3 w-3 mr-1" />
          <span>Completed</span>
        </div>
      )}
      
      {/* Actions */}
      <div className="flex gap-2 mt-4">
        <Button size="sm" className="w-full flex items-center gap-2 bg-primary hover:bg-primary/90">
          {getActionIcon()}
          <span>{getActionText()}</span>
        </Button>
        
        <Button size="icon" variant="outline">
          <Bookmark className="h-4 w-4" />
          <span className="sr-only">Save</span>
        </Button>
      </div>
    </div>
  );
};

export default ContentFreeOverlay;
