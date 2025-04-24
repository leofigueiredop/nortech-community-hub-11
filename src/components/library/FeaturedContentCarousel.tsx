
import React, { useState } from 'react';
import { ContentItem } from '@/types/library';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Play, Crown, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface FeaturedContentCarouselProps {
  items: ContentItem[];
  onItemSelect: (item: ContentItem) => void;
}

const FeaturedContentCarousel: React.FC<FeaturedContentCarouselProps> = ({ 
  items, 
  onItemSelect 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  if (!items.length) return null;
  
  return (
    <div 
      className="relative rounded-xl overflow-hidden mb-12"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Carousel
        opts={{
          loop: true,
        }}
      >
        <CarouselContent>
          {items.map((item) => (
            <CarouselItem key={item.id}>
              <div className="relative aspect-[21/9] overflow-hidden rounded-xl group">
                {/* Feature image */}
                <img 
                  src={item.thumbnailUrl || item.thumbnail} 
                  alt={item.title}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-75"
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                
                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 lg:max-w-3xl">
                  <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-white mb-2">{item.title}</h2>
                  <p className="text-sm md:text-base text-white/80 mb-4 line-clamp-2">{item.description}</p>
                  
                  <div className="flex items-center gap-3 mb-4">
                    {/* Format badge */}
                    <Badge variant="secondary" className="bg-white/20 border-none">
                      {item.format.charAt(0).toUpperCase() + item.format.slice(1)}
                    </Badge>
                    
                    {/* Premium badge */}
                    {item.accessLevel === 'premium' && (
                      <Badge className="bg-amber-500 text-white border-none">
                        <Crown size={14} className="mr-1" />
                        Premium
                      </Badge>
                    )}
                    
                    {/* Duration */}
                    {item.duration > 0 && (
                      <span className="text-sm text-white/70">
                        {Math.floor(item.duration / 60)} min
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      className="gap-2 bg-white text-black hover:bg-white/90"
                      onClick={() => onItemSelect(item)}
                    >
                      {['video', 'course'].includes(item.format) ? (
                        <>
                          <Play size={16} className="fill-current" />
                          <span>Watch Now</span>
                        </>
                      ) : (
                        <>
                          <span>View Now</span>
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="gap-2 bg-white/10 border-white/30 text-white hover:bg-white/20"
                      onClick={() => onItemSelect(item)}
                    >
                      <Info size={16} />
                      <span>More Info</span>
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <div className={`transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <CarouselPrevious className="left-4 bg-black/30 border-none hover:bg-black/50" />
          <CarouselNext className="right-4 bg-black/30 border-none hover:bg-black/50" />
        </div>
      </Carousel>
    </div>
  );
};

export default FeaturedContentCarousel;
