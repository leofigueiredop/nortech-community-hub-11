
import React from 'react';
import { ContentItem } from '@/types/library';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Play, Crown, Clock, BookOpen, FileText, FileAudio, Link } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ContentCardMediaProps {
  item: ContentItem;
  isHovered?: boolean;
  isPremium?: boolean;
}

const ContentCardMedia: React.FC<ContentCardMediaProps> = ({ 
  item, 
  isHovered = false,
  isPremium = false
}) => {
  // Format-specific elements
  const isVideo = ['video', 'youtube', 'vimeo'].includes(item.format);
  const isPDF = ['pdf', 'text', 'gdoc'].includes(item.format);
  const isAudio = item.format === 'audio';
  const isCourse = item.format === 'course';
  const isLink = item.format === 'link';

  const getFormatIcon = () => {
    switch (true) {
      case isVideo:
        return <Play className="h-4 w-4" />;
      case isPDF:
        return <FileText className="h-4 w-4" />;
      case isAudio:
        return <FileAudio className="h-4 w-4" />;
      case isCourse:
        return <BookOpen className="h-4 w-4" />;
      case isLink:
        return <Link className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="relative">
      <AspectRatio ratio={16/9} className="bg-muted overflow-hidden">
        <img 
          src={item.thumbnailUrl || item.thumbnail || '/placeholder.svg'} 
          alt={item.title}
          className={cn(
            "w-full h-full object-cover transition-all duration-300",
            isHovered && "scale-105 brightness-75"
          )}
        />
        
        {isVideo && isHovered && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-12 w-12 bg-primary rounded-full flex items-center justify-center shadow-lg">
              <Play fill="white" className="h-6 w-6 text-white ml-1" />
            </div>
          </div>
        )}
        
        {/* Duration badge */}
        {item.duration > 0 && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center">
            <Clock size={12} className="mr-1" />
            <span>
              {Math.floor(item.duration / 60)}:{(item.duration % 60).toString().padStart(2, '0')}
            </span>
          </div>
        )}

        {/* Format badge */}
        <Badge 
          variant="secondary" 
          className="absolute top-2 left-2 text-xs bg-black/70 text-white border-none flex items-center gap-1"
        >
          {getFormatIcon()}
          <span>{item.format.charAt(0).toUpperCase() + item.format.slice(1)}</span>
        </Badge>
        
        {/* Premium indicator */}
        {isPremium && (
          <Badge 
            className="absolute top-2 right-2 font-medium text-xs bg-amber-500 text-white shadow border-none flex items-center gap-1"
          >
            <Crown className="h-3 w-3" />
            <span>PREMIUM</span>
          </Badge>
        )}
      </AspectRatio>
    </div>
  );
};

export default ContentCardMedia;
