
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
          <Badge variant="outline" className="text-xs px-1.5 py-0 h-5">
            {item.format}
          </Badge>
          
          <span className="flex items-center">
            <Eye size={12} className="mr-1" />
            {item.views}
          </span>
        </div>
        
        {item.duration && (
          <span className="flex items-center">
            <Clock size={12} className="mr-1" />
            {formatDuration(item.duration)}
          </span>
        )}
      </div>
    </div>
  );
};

export default ContentCardInfo;
