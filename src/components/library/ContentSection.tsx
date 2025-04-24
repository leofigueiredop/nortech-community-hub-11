
import React from 'react';
import { ContentItem } from '@/types/library';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem,
  CarouselNext,
  CarouselPrevious 
} from '@/components/ui/carousel';
import EnhancedContentCard from './EnhancedContentCard';
import Autoplay from 'embla-carousel-autoplay';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface ContentSectionProps {
  title: string;
  items: ContentItem[];
  onItemSelect: (item: ContentItem) => void;
  isTopTen?: boolean;
  layout?: 'grid' | 'carousel';
  viewAllUrl?: string; // Added this prop
  showNewBadge?: boolean; // Added this prop
}

const ContentSection: React.FC<ContentSectionProps> = ({
  title,
  items,
  onItemSelect,
  isTopTen = false,
  layout = 'grid',
  viewAllUrl,
  showNewBadge
}) => {
  const autoplayPlugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold">{title}</h2>
        
        {viewAllUrl && (
          <Link to={viewAllUrl}>
            <Button variant="ghost" size="sm" className="text-sm flex items-center gap-1">
              View All <ChevronRight size={14} />
            </Button>
          </Link>
        )}
      </div>

      {layout === 'carousel' || isTopTen ? (
        <div className="relative">
          <Carousel 
            opts={{
              align: 'start',
              loop: true
            }}
            plugins={isTopTen ? [autoplayPlugin.current] : []}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {items.map((item) => (
                <CarouselItem key={item.id} className="pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <EnhancedContentCard
                    item={item}
                    onClick={() => onItemSelect(item)}
                    isNew={showNewBadge}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <EnhancedContentCard
              key={item.id}
              item={item}
              onClick={() => onItemSelect(item)}
              isNew={showNewBadge && new Date(item.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentSection;
