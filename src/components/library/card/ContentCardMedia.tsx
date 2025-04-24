import React from 'react';
import { ContentItem } from '@/types/library';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star } from 'lucide-react';
import { useContentProgress } from '@/hooks/useContentProgress';

export interface ContentCardMediaProps {
  item: ContentItem;
  isTopPick?: boolean;
  rank?: number;
  showProgress?: boolean;
}

const ContentCardMedia = ({ item, isTopPick, rank, showProgress = false }: ContentCardMediaProps) => {
  const { getProgress } = useContentProgress();
  const progress = getProgress(item.id)?.progress || 0;

  return (
    <div className="relative aspect-video w-full overflow-hidden">
      <img 
        src={item.thumbnail} 
        alt={item.title} 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      
      {/* Top Pick Badge */}
      {isTopPick && (
        <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-md font-medium">
          Top Pick
        </div>
      )}
      
      {/* Rank Badge */}
      {rank !== undefined && (
        <div className="absolute top-2 left-2 bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
          {rank}
        </div>
      )}
      
      {/* Format Badge */}
      <Badge 
        variant="outline" 
        className="absolute top-2 right-2 bg-black/50 text-white border-none text-xs"
      >
        {item.format}
      </Badge>
      
      {/* Points Badge */}
      {item.pointsEnabled && item.pointsValue && (
        <div className="absolute bottom-2 right-2 bg-amber-500/90 text-white text-xs px-2 py-0.5 rounded-md flex items-center">
          <Star className="h-3 w-3 mr-1" />
          <span>{item.pointsValue} XP</span>
        </div>
      )}
      
      {/* Progress Bar */}
      {showProgress && progress > 0 && (
        <div className="absolute bottom-0 left-0 right-0">
          <Progress value={progress} className="h-1 rounded-none" />
        </div>
      )}
    </div>
  );
};

export default ContentCardMedia;
