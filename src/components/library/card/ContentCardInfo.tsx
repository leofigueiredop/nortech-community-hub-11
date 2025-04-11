
import React from 'react';
import { ContentItem } from '@/types/library';
import { Eye, Clock } from 'lucide-react';

interface ContentCardInfoProps {
  item: ContentItem;
}

const ContentCardInfo: React.FC<ContentCardInfoProps> = ({ item }) => {
  return (
    <div className="p-3 transition-opacity duration-300">
      <h3 className="font-medium text-base line-clamp-1">{item.title}</h3>
      
      <div className="flex items-center text-xs text-muted-foreground mt-1">
        <span className="capitalize mr-2">{item.format}</span>
        <span className="flex items-center">
          <Eye className="h-3 w-3 mr-1" />
          {item.views}
        </span>
        {item.duration && (
          <span className="flex items-center ml-2">
            <Clock className="h-3 w-3 mr-1" />
            {item.duration}
          </span>
        )}
      </div>
    </div>
  );
};

export default ContentCardInfo;
