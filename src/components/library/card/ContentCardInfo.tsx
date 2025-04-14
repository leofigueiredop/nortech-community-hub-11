
import React from 'react';
import { ContentItem } from '@/types/library';
import { Eye, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDuration } from '../viewer/contentViewerUtils';

interface ContentCardInfoProps {
  item: ContentItem;
}

const ContentCardInfo: React.FC<ContentCardInfoProps> = ({ item }) => {
  return (
    <div className="p-4 bg-card space-y-2">
      <h3 className="font-medium text-sm line-clamp-2 min-h-[2.5rem] leading-tight">{item.title}</h3>
      
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          {item.views > 0 && (
            <span className="flex items-center">
              <Eye size={12} className="mr-1 flex-shrink-0" />
              <span className="truncate max-w-[70px]">{item.views.toLocaleString()}</span>
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
      
      {/* Tags - limited to 2 */}
      {item.tags && item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {item.tags.slice(0, 2).map(tag => (
            <Badge 
              key={tag} 
              variant="secondary" 
              className="text-xs px-2 py-0.5 h-5 opacity-70 truncate max-w-[100px]"
            >
              {tag}
            </Badge>
          ))}
          {item.tags.length > 2 && (
            <span className="text-xs text-muted-foreground">+{item.tags.length - 2}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default ContentCardInfo;
