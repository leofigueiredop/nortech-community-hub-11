
import React from 'react';
import { ContentItem } from '@/types/library';
import EnhancedContentCard from './EnhancedContentCard';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';

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
  if (layout === 'carousel') {
    return (
      <div className="relative py-4">
        {title && (
          <h2 className="text-2xl font-semibold mb-4">{title}</h2>
        )}
        
        <Carousel
          opts={{
            align: "start",
            loop: items.length > 4,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {items.map((item, index) => (
              <CarouselItem key={item.id} className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                <EnhancedContentCard
                  item={item}
                  onClick={() => onItemSelect(item)}
                  rankNumber={isTopTen ? index + 1 : undefined}
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

  // Grid layout
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {items.map((item, index) => (
        <EnhancedContentCard
          key={item.id}
          item={item}
          onClick={() => onItemSelect(item)}
          rankNumber={isTopTen ? index + 1 : undefined}
        />
      ))}
    </div>
  );
};

export default ContentSection;
