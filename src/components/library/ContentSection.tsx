
import React, { useState } from 'react';
import { ContentItem } from '@/types/library';
import EnhancedContentCard from './EnhancedContentCard';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft } from 'lucide-react';
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
  layout?: 'carousel' | 'grid'; // Added layout property
}

const ContentSection: React.FC<ContentSectionProps> = ({ 
  title, 
  items, 
  onItemSelect,
  viewAllUrl,
  isTopTen = false,
  layout = 'carousel' // Default to carousel
}) => {
  const [isHovered, setIsHovered] = useState(false);

  if (items.length === 0) return null;

  // If layout is grid, render a grid of cards
  if (layout === 'grid') {
    return (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">{title}</h2>
          
          {viewAllUrl && (
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              View All <ChevronRight size={16} />
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {items.map((item, index) => (
            <EnhancedContentCard
              key={item.id}
              item={item}
              onClick={() => onItemSelect(item)}
              rankNumber={isTopTen && index < 10 ? index + 1 : undefined}
            />
          ))}
        </div>
      </div>
    );
  }

  // Default carousel layout
  return (
    <div 
      className="mb-8 relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold group-hover:text-primary transition-colors duration-300">
          {title}
        </h2>
        
        {viewAllUrl && (
          <Button variant="ghost" size="sm" className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            View All <ChevronRight size={16} />
          </Button>
        )}
      </div>
      
      <Carousel
        opts={{
          align: "start",
          loop: items.length > 6,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {items.map((item, index) => (
            <CarouselItem key={item.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
              <EnhancedContentCard
                item={item}
                onClick={() => onItemSelect(item)}
                rankNumber={isTopTen && index < 10 ? index + 1 : undefined}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <div className={`transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <CarouselPrevious className="left-1" />
          <CarouselNext className="right-1" />
        </div>
      </Carousel>
    </div>
  );
};

export default ContentSection;
