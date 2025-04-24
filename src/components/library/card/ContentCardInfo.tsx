import React from 'react';
import { ContentItem } from '@/types/library';

export interface ContentCardInfoProps {
  item: ContentItem;
  showAuthor?: boolean;
  showPoints?: boolean;
  isCompact?: boolean;
}

const ContentCardInfo = ({ item, showAuthor, showPoints, isCompact }: ContentCardInfoProps) => {
  const { getProgress } = useContentProgress();
  const progress = getProgress(item.id);
  const isCompleted = progress?.completed || false;
  
  return (
    <div className="p-4 bg-card space-y-2">
      <h3 className="font-medium text-sm line-clamp-2 min-h-[2.5rem] leading-tight">{item.title}</h3>
      
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          {item.views > 0 && (
            <span className="flex items-center">
              <Eye size={12} className="mr-1 flex-shrink-0" />
              <span className="truncate max-w-[40px]">{item.views.toLocaleString()}</span>
            </span>
          )}
        </div>
        
        {item.duration > 0 && (
          <span className="flex items-center">
            <Clock size={12} className="mr-1 flex-shrink-0" />
            <span className="truncate max-w-[70px]">{formatDuration(item.duration)}</span>
          </span>
        )}
      </div>
      
      <div className="flex justify-between items-center">
        {/* Tags - limited to 1 */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            <Badge 
              key={item.tags[0]} 
              variant="secondary" 
              className="text-xs px-2 py-0.5 h-5 opacity-70 truncate max-w-[90px]"
            >
              {item.tags[0]}
            </Badge>
            {item.tags.length > 1 && (
              <span className="text-xs text-muted-foreground">+{item.tags.length - 1}</span>
            )}
          </div>
        )}
        
        {/* Gamification indicators */}
        <div className="flex items-center gap-1.5">
          {item.pointsEnabled && item.pointsValue > 0 && (
            <span className="flex items-center text-xs font-medium text-amber-500">
              <Star size={12} className="mr-0.5 flex-shrink-0" />
              {item.pointsValue}
            </span>
          )}
          
          {isCompleted && (
            <span className="flex items-center text-xs font-medium text-green-500">
              <CheckCircle size={12} className="flex-shrink-0" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentCardInfo;
