
import React, { useState } from 'react';
import { ContentItem } from '@/types/library';
import EnhancedContentCard from './EnhancedContentCard';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
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
  viewAllUrl?: string;
  isTopTen?: boolean;
  layout?: 'carousel' | 'grid';
  showNewBadge?: boolean;
}

const ContentSection: React.FC<ContentSectionProps> = ({ 
  title, 
  items, 
  onItemSelect,
  viewAllUrl,
  isTopTen = false,
  layout = 'carousel',
  showNewBadge = false
}) => {
  const [isHovered, setIsHovered] = useState(false);

  if (items.length === 0) return null;

  // If layout is grid, render a grid of cards
  if (layout === 'grid') {
    return (
      <div className="mb-12">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl sm:text-3xl font-semibold text-foreground">{title}</h2>
          
          {viewAllUrl && (
            <Button variant="ghost" size="sm" className="flex items-center gap-1 text-primary hover:text-primary/80">
              View All <ChevronRight size={16} />
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {items.map((item, index) => (
            <div key={item.id} className="h-full">
              <EnhancedContentCard
                item={item}
                onClick={() => onItemSelect(item)}
                rankNumber={isTopTen && index < 10 ? index + 1 : undefined}
                isNew={showNewBadge && new Date(item.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default carousel layout
  return (
    <div 
      className="mb-12 py-4" 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
          {title}
        </h2>
        
        {viewAllUrl && (
          <Button variant="ghost" size="sm" className="flex items-center gap-1 text-primary hover:text-primary/80">
            View All <ChevronRight size={16} />
          </Button>
        )}
      </div>
      
      <Carousel
        opts={{
          align: "start",
          loop: items.length > 4,
          dragFree: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-3 md:-ml-4">
          {items.map((item, index) => (
            <CarouselItem 
              key={item.id} 
              className="pl-3 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 2xl:basis-1/6"
            >
              <div className="h-full">
                <EnhancedContentCard
                  item={item}
                  onClick={() => onItemSelect(item)}
                  rankNumber={isTopTen && index < 10 ? index + 1 : undefined}
                  isNew={showNewBadge && new Date(item.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <div className={`transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <CarouselPrevious className="h-8 w-8 left-0 -translate-x-1/2 bg-background/80 border-none hover:bg-background shadow-md" />
          <CarouselNext className="h-8 w-8 right-0 translate-x-1/2 bg-background/80 border-none hover:bg-background shadow-md" />
        </div>
      </Carousel>
    </div>
  );
};

export default ContentSection;
