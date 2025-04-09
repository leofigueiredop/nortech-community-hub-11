
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ContentItem } from '@/types/library';
import { Lock, Play, Clock, Eye, Bookmark } from 'lucide-react';
import { ContentFormatIcon } from './management/utils/ContentFormatIcon';

interface ContentCardProps {
  item: ContentItem;
  onClick: () => void;
}

const ContentCard: React.FC<ContentCardProps> = ({ item, onClick }) => {
  return (
    <Card 
      className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
      onClick={onClick}
    >
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={item.thumbnailUrl || '/placeholder.svg'} 
          alt={item.title}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        
        {/* Format badge */}
        <div className="absolute top-2 left-2 bg-black/60 text-white px-2 py-1 rounded-md text-xs flex items-center">
          <ContentFormatIcon format={item.format} size={14} />
          <span className="ml-1">{item.format.toUpperCase()}</span>
        </div>
        
        {/* Premium badge */}
        {item.accessLevel === 'premium' && (
          <div className="absolute top-2 right-2 bg-purple-500 text-white px-2 py-1 rounded-md text-xs flex items-center">
            <Lock size={12} className="mr-1" />
            Premium
          </div>
        )}
        
        {/* Play button overlay for videos */}
        {['video', 'youtube', 'vimeo'].includes(item.format) && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
              <Play className="text-white" size={24} />
            </div>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-medium text-lg line-clamp-1 mb-1">{item.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{item.description}</p>
        
        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {item.tags.slice(0, 3).map(tag => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="text-xs border-purple-300 text-purple-700 dark:text-purple-300"
              >
                #{tag}
              </Badge>
            ))}
            {item.tags.length > 3 && (
              <span className="text-xs text-muted-foreground">+{item.tags.length - 3}</span>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="px-4 py-2 border-t flex justify-between text-xs text-muted-foreground">
        <div className="flex items-center">
          {item.duration && (
            <span className="flex items-center mr-3">
              <Clock size={14} className="mr-1" />
              {item.duration}
            </span>
          )}
          <span className="flex items-center">
            <Eye size={14} className="mr-1" />
            {item.views}
          </span>
        </div>
        <div>
          {item.createdAt && (
            <span>
              {new Date(item.createdAt).toLocaleDateString(undefined, { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}
            </span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ContentCard;
