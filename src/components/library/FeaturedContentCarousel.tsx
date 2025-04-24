import React, { useState, useEffect } from 'react';
import { ContentItem } from '@/types/library';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { Button } from '@/components/ui/button';
import { Play, Crown, Info, Clock, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { formatDuration } from './viewer/contentViewerUtils';

interface FeaturedContentCarouselProps {
  items: ContentItem[];
  onItemSelect: (item: ContentItem) => void;
}

const FeaturedContentCarousel: React.FC<FeaturedContentCarouselProps> = ({ 
  items, 
  onItemSelect 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const autoplayPlugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  useEffect(() => {
    if (!isHovered && autoplayPlugin.current) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isHovered, autoplayPlugin.current, items.length]);
  
  if (!items.length) return null;
  
  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'video':
      case 'youtube':
      case 'vimeo':
        return <Play size={14} />;
      case 'pdf':
      case 'text':
        return <FileText size={14} />;
      default:
        return null;
    }
  };
  
  return (
    <div 
      className="relative rounded-xl overflow-hidden mb-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Carousel
        opts={{
          loop: true,
          align: 'start'
        }}
        plugins={[autoplayPlugin.current]}
        className="w-full"
        setApi={(api) => {
          api?.on('select', () => {
            setCurrentIndex(api?.selectedScrollSnap() || 0);
          });
        }}
      >
        <CarouselContent>
          {items.map((item) => (
            <CarouselItem key={item.id}>
              <div className="relative aspect-[21/9] overflow-hidden rounded-xl group">
                <img 
                  src={item.thumbnailUrl || item.thumbnail || '/placeholder.svg'} 
                  alt={item.title}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 lg:p-10 lg:max-w-3xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="bg-background/20 border-none text-white">
                      {getFormatIcon(item.format)}
                      <span className="ml-1">{item.format.charAt(0).toUpperCase() + item.format.slice(1)}</span>
                    </Badge>
                    
                    {item.accessLevel === 'premium' && (
                      <Badge className="bg-amber-500 text-white border-none">
                        <Crown size={14} className="mr-1" />
                        Premium
                      </Badge>
                    )}
                    
                    {item.duration > 0 && (
                      <span className="flex items-center text-sm text-white/70">
                        <Clock size={14} className="mr-1" />
                        {formatDuration(item.duration)}
                      </span>
                    )}
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-white mb-2">{item.title}</h2>
                    <p className="text-sm md:text-base text-white/80 mb-4 line-clamp-2">{item.description}</p>
                  </motion.div>
                  
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      className="gap-2 bg-white text-black hover:bg-white/90 shadow-md"
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
                      className="gap-2 bg-black/40 border-white/30 text-white hover:bg-black/60"
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
          <CarouselPrevious className="left-4 bg-black/40 border-none hover:bg-black/70 text-white" />
          <CarouselNext className="right-4 bg-black/40 border-none hover:bg-black/70 text-white" />
        </div>
        
        {items.length > 1 && (
          <div className="absolute bottom-4 right-4 flex gap-1.5">
            {items.map((_, index) => (
              <div 
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentIndex === index ? 'bg-white scale-125' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        )}
      </Carousel>
    </div>
  );
};

export default FeaturedContentCarousel;
