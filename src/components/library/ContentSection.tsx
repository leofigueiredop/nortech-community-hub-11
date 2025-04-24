
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

interface ContentSectionProps {
  title: string;
  items: ContentItem[];
  onItemSelect: (item: ContentItem) => void;
  isTopTen?: boolean;
  layout?: 'grid' | 'carousel';
}

const ContentSection: React.FC<ContentSectionProps> = ({
  title,
  items,
  onItemSelect,
  isTopTen = false,
  layout = 'grid'
}) => {
  const autoplayPlugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  if (layout === 'carousel') {
    return (
      <div className="relative space-y-4">
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
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <EnhancedContentCard
          key={item.id}
          item={item}
          onClick={() => onItemSelect(item)}
        />
      ))}
    </div>
  );
};

export default ContentSection;
