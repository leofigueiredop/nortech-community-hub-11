
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
    <div className="p-3 bg-card">
      <h3 className="font-medium text-sm line-clamp-1 mb-1">{item.title}</h3>
      
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          {item.views > 0 && (
            <span className="flex items-center">
              <Eye size={12} className="mr-1" />
              {item.views}
            </span>
          )}
        </div>
        
        {item.duration > 0 && (
          <span className="flex items-center">
            <Clock size={12} className="mr-1" />
            {formatDuration(item.duration)}
          </span>
        )}
      </div>
      
      {/* Tags - limited to 2 */}
      {item.tags && item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1.5">
          {item.tags.slice(0, 2).map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs px-1.5 py-0 h-5 opacity-70">
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
