
import React from 'react';
import { ContentItem } from '@/types/library';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { adaptLibraryItemToContentType } from '@/utils/contentTypeAdapter';
import ContentCard from './card/ContentCard';

interface FeaturedContentProps {
  title: string;
  items: ContentItem[];
  viewAllUrl?: string;
  onItemSelect?: (item: ContentItem) => void;
  className?: string;
}

const FeaturedContent: React.FC<FeaturedContentProps> = ({
  title,
  items,
  viewAllUrl,
  onItemSelect,
  className
}) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        {viewAllUrl && (
          <Link to={viewAllUrl}>
            <Button variant="ghost" size="sm" className="gap-1">
              View all <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <ContentCard
            key={item.id}
            item={item}
            onClick={() => onItemSelect?.(item)}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedContent;
