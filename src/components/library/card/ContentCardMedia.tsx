
import React from 'react';
import { ContentItem } from '@/types/library';
import { useContentProgress } from '@/hooks/useContentProgress';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PlayCircle, FileText, Headphones, BookOpen } from 'lucide-react';

interface ContentCardMediaProps {
  item: ContentItem;
  onClick?: () => void;
}

const ContentCardMedia: React.FC<ContentCardMediaProps> = ({ item, onClick }) => {
  const { getProgress } = useContentProgress();
  const itemProgress = getProgress(item.id);
  const progress = itemProgress?.progress_percent || 0;
  
  const getFormatIcon = () => {
    switch (item.format) {
      case 'video':
        return <PlayCircle className="w-10 h-10 text-white opacity-80" />;
      case 'document':
      case 'pdf':
        return <FileText className="w-10 h-10 text-white opacity-80" />;
      case 'audio':
        return <Headphones className="w-10 h-10 text-white opacity-80" />;
      case 'course':
        return <BookOpen className="w-10 h-10 text-white opacity-80" />;
      default:
        return null;
    }
  };
  
  // Premium badge (premium or premium_plus)
  const isPremium = item.access_level === 'premium' || item.access_level === 'premium_plus';
  
  return (
    <div 
      className="relative aspect-video overflow-hidden rounded-t-md cursor-pointer group"
      onClick={onClick}
    >
      {/* Thumbnail Image */}
      <img 
        src={item.thumbnail || item.thumbnailUrl || `https://via.placeholder.com/320x180?text=${item.title}`} 
        alt={item.title} 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-center justify-center">
        {getFormatIcon()}
      </div>
      
      {/* Format Badge */}
      <Badge 
        variant="outline"
        className="absolute top-2 right-2 bg-black/60 text-white border-none text-xs"
      >
        {item.format}
      </Badge>
      
      {/* Premium Badge */}
      {isPremium && (
        <Badge 
          className="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white border-none"
        >
          Premium
        </Badge>
      )}
      
      {/* Progress Bar */}
      {progress > 0 && (
        <div className="absolute bottom-0 left-0 right-0">
          <Progress value={progress} className="h-1 rounded-none" />
        </div>
      )}
    </div>
  );
};

export default ContentCardMedia;
