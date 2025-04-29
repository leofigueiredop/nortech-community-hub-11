
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ContentItem } from '@/types/library';
import { useContentProgress } from '@/hooks/useContentProgress';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star, Clock, Eye, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnhancedContentCardProps {
  item: ContentItem;
  onSelect?: (item: ContentItem) => void;
  rank?: number;
  showBadge?: boolean;
  showAuthor?: boolean;
  className?: string;
  isNew?: boolean;
  onClick?: () => void;
}

const EnhancedContentCard: React.FC<EnhancedContentCardProps> = ({ 
  item, 
  onSelect,
  rank,
  showBadge = true,
  showAuthor = true,
  className,
  isNew = false,
  onClick
}) => {
  const { getProgress } = useContentProgress();
  const progress = getProgress(item.id)?.progress_percent || 0;
  
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
      return;
    }
    
    if (item.format === 'course') {
      // For courses, we want to show a modal first
      if (onSelect) {
        e.preventDefault();
        onSelect(item);
      }
    } else {
      // For other content types, open in content viewer
      if (onSelect) {
        e.preventDefault();
        onSelect(item);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "group bg-card border rounded-md overflow-hidden shadow-sm hover:shadow-md transition-all",
        className
      )}
    >
      <div onClick={handleClick} className="cursor-pointer h-full">
        <div className="relative aspect-video w-full overflow-hidden">
          <img 
            src={item.thumbnail || item.thumbnailUrl} 
            alt={item.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
          
          {/* Premium Overlay */}
          {(item.access_level === 'premium' || item.access_level === 'premium_plus') && (
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
          )}
          
          {/* Progress bar */}
          {progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0">
              <Progress value={progress} className="h-1 rounded-none" />
            </div>
          )}
          
          {/* Format badge */}
          {showBadge && (
            <Badge 
              variant="outline" 
              className="absolute top-2 right-2 bg-black/50 text-white border-none text-xs px-2"
            >
              {item.format}
            </Badge>
          )}
          
          {/* Premium badge */}
          {(item.access_level === 'premium' || item.access_level === 'premium_plus') && (
            <Badge 
              className="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white border-none text-xs px-2 py-1 flex items-center gap-1"
            >
              <Crown size={14} />
              <span>Premium</span>
            </Badge>
          )}
          
          {/* New badge */}
          {isNew && (
            <Badge 
              className="absolute top-2 left-2 bg-green-500 text-white border-none text-xs px-2"
            >
              New
            </Badge>
          )}
          
          {/* Title and details */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="font-bold text-white text-lg line-clamp-2">
              {item.title}
            </h3>
            
            {/* Stats row */}
            <div className="flex items-center gap-3 mt-2">
              {item.points_enabled && item.points_value && (
                <div className="flex items-center text-xs text-amber-300">
                  <Star className="h-3 w-3 mr-1" />
                  <span>{item.points_value} XP</span>
                </div>
              )}
              
              {item.duration > 0 && (
                <div className="flex items-center text-xs text-slate-300">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{Math.round(item.duration / 60)} min</span>
                </div>
              )}
              
              <div className="flex items-center text-xs text-slate-300">
                <Eye className="h-3 w-3 mr-1" />
                <span>{item.views}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {item.description}
          </p>
          
          {showAuthor && (
            <div className="flex items-center gap-2">
              {item.author && typeof item.author === 'object' && item.author !== null ? (
                <>
                  <div className="w-6 h-6 rounded-full overflow-hidden bg-muted">
                    {item.author.avatar && (
                      <img 
                        src={item.author.avatar} 
                        alt={item.author.name || 'Author'}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {item.author.name || 'Anonymous'} • {formatDistanceToNow(new Date(item.updated_at || item.updated_at || ''), { addSuffix: true })}
                  </span>
                </>
              ) : item.author && typeof item.author === 'string' ? (
                <span className="text-xs text-muted-foreground">
                  {item.author} • {formatDistanceToNow(new Date(item.updated_at || item.updated_at || ''), { addSuffix: true })}
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">
                  Anonymous • {formatDistanceToNow(new Date(item.updated_at || item.updated_at || ''), { addSuffix: true })}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default EnhancedContentCard;
