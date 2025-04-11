
import React from 'react';
import { ContentItem } from '@/types/library';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getContentActionText } from './contentCardUtils';

interface ContentFreeOverlayProps {
  item: ContentItem;
}

const ContentFreeOverlay: React.FC<ContentFreeOverlayProps> = ({ item }) => {
  return (
    <div className="absolute inset-0 bg-black/70 flex flex-col justify-between p-4 transition-opacity duration-300">
      <div className="flex justify-between">
        <Badge className="bg-nortech-purple text-white">
          {item.format.toUpperCase()}
        </Badge>
      </div>
      
      <div>
        <h3 className="text-white font-semibold mb-1">{item.title}</h3>
        <p className="text-white/80 text-sm line-clamp-3 mb-3">{item.description}</p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {item.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="outline" className="border-white/30 text-white/80 text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <Button 
          className="w-full bg-nortech-purple hover:bg-nortech-purple/90"
          size="sm"
        >
          {getContentActionText(item.format)} Now
        </Button>
      </div>
    </div>
  );
};

export default ContentFreeOverlay;
