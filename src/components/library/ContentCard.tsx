
import React from 'react';
import { Link } from 'react-router-dom';
import { ContentItem } from '@/types/library';
import ContentCardMedia from './card/ContentCardMedia';
import ContentCardInfo from './card/ContentCardInfo';
import { cn } from '@/lib/utils';

interface ContentCardProps {
  item: ContentItem;
  onSelect?: (item: ContentItem) => void;
  className?: string;
  showAuthor?: boolean;
  showPoints?: boolean;
  isCompact?: boolean;
  isTopPick?: boolean;
  rank?: number;
  showProgress?: boolean;
}

const ContentCard: React.FC<ContentCardProps> = ({
  item,
  onSelect,
  className,
  showAuthor = true,
  showPoints = true,
  isCompact = false,
  isTopPick = false,
  rank,
  showProgress = false
}) => {
  const handleCardClick = (e: React.MouseEvent) => {
    // If it's a course, navigate to course page instead of opening modal
    if (item.format === 'course') {
      // Don't call onSelect for courses
      return;
    }
    
    // For other content types, call onSelect to open the modal
    if (onSelect) {
      e.preventDefault();
      onSelect(item);
    }
  };

  return (
    <div 
      className={cn(
        "group bg-card rounded-lg border shadow-sm overflow-hidden hover:shadow-md transition-all",
        isCompact ? "h-full flex flex-col" : "",
        className
      )}
    >
      {item.format === 'course' ? (
        <Link to={`/course/${item.id}`} className="block h-full">
          <ContentCardMedia 
            item={item} 
            isTopPick={isTopPick} 
            rank={rank} 
            showProgress={showProgress} 
          />
          <ContentCardInfo 
            item={item} 
            showAuthor={showAuthor} 
            showPoints={showPoints} 
            isCompact={isCompact} 
          />
        </Link>
      ) : (
        <div onClick={handleCardClick} className="cursor-pointer h-full">
          <ContentCardMedia 
            item={item} 
            isTopPick={isTopPick} 
            rank={rank} 
            showProgress={showProgress} 
          />
          <ContentCardInfo 
            item={item} 
            showAuthor={showAuthor} 
            showPoints={showPoints} 
            isCompact={isCompact} 
          />
        </div>
      )}
    </div>
  );
};

export default ContentCard;
