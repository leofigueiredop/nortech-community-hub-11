
import React, { useState, useRef } from 'react';
import { ContentItem } from '@/types/library';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import EnhancedContentCard from './EnhancedContentCard';

interface ContentRowProps {
  items: ContentItem[];
  onItemSelect: (item: ContentItem) => void;
  isTopTen?: boolean;
}

const ContentRow: React.FC<ContentRowProps> = ({ items, onItemSelect, isTopTen = false }) => {
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const scrollLeft = () => {
    if (scrollRef.current) {
      const width = scrollRef.current.clientWidth;
      scrollRef.current.scrollBy({ left: -width * 0.75, behavior: 'smooth' });
    }
  };
  
  const scrollRight = () => {
    if (scrollRef.current) {
      const width = scrollRef.current.clientWidth;
      scrollRef.current.scrollBy({ left: width * 0.75, behavior: 'smooth' });
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="relative group py-4">
      {/* Netflix-style side navigation arrows */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent z-10 flex items-center justify-start opacity-0 group-hover:opacity-100 transition-opacity">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full bg-background/80 hover:bg-background w-10 h-10"
          onClick={scrollLeft}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>
      
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent z-10 flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full bg-background/80 hover:bg-background w-10 h-10"
          onClick={scrollRight}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
      
      <div ref={scrollRef} className="flex space-x-6 overflow-x-auto py-4 pb-8 scrollbar-hide">
        {items.map((item, index) => (
          <div 
            key={item.id}
            className="flex-none w-[280px] md:w-[320px] relative"
          >
            <EnhancedContentCard 
              item={item}
              onClick={() => onItemSelect(item)}
              rankNumber={isTopTen ? index + 1 : undefined}
            />
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" className="opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};

export default ContentRow;
