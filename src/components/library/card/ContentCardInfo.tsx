
import React from 'react';
import { ContentItem } from '@/types/library';
import { useContentProgress } from '@/hooks/useContentProgress';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle, Clock, Eye, Star } from 'lucide-react';

interface ContentCardInfoProps {
  item: ContentItem;
}

const ContentCardInfo: React.FC<ContentCardInfoProps> = ({ item }) => {
  const { getProgress } = useContentProgress();
  const progress = getProgress(item.id);
  const isCompleted = progress?.completed_at !== null;
  
  return (
    <div className="p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold line-clamp-2 flex-1 text-foreground">{item.title}</h3>
        {isCompleted && (
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 ml-2" />
        )}
      </div>
      
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
        {item.description || 'No description available'}
      </p>
      
      <div className="flex items-center text-xs text-muted-foreground gap-4">
        {item.updated_at && (
          <span>
            {formatDistanceToNow(new Date(item.updated_at), { addSuffix: true })}
          </span>
        )}
        
        {item.duration && (
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            <span>{Math.round(item.duration / 60)} min</span>
          </div>
        )}
        
        {item.views !== undefined && (
          <div className="flex items-center">
            <Eye className="w-3 h-3 mr-1" />
            <span>{item.views}</span>
          </div>
        )}
        
        {item.points_value && item.points_enabled && (
          <div className="flex items-center text-amber-500">
            <Star className="w-3 h-3 mr-1" />
            <span>{item.points_value} XP</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentCardInfo;
