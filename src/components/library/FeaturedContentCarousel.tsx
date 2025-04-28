
import React, { useState, useEffect } from 'react';
import { ContentItem } from '@/types/content';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface FeaturedContentCarouselProps {
  items: ContentItem[];
  onSelect: (item: ContentItem) => void;
}

const FeaturedContentCarousel: React.FC<FeaturedContentCarouselProps> = ({
  items,
  onSelect,
}) => {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto advance slider
  useEffect(() => {
    if (!isAutoPlaying || items.length <= 1) return;
    
    const timer = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % items.length);
    }, 6000);
    
    return () => clearTimeout(timer);
  }, [current, items.length, isAutoPlaying]);
  
  // Stop auto-play on user interaction
  const handleManualNavigate = (index: number) => {
    setIsAutoPlaying(false);
    setCurrent(index);
  };

  if (items.length === 0) return null;

  const item = items[current];

  return (
    <div className="relative overflow-hidden rounded-xl h-[350px] md:h-[450px]">
      {/* Navigation buttons */}
      {items.length > 1 && (
        <>
          <Button
            size="icon"
            variant="outline"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 border-none text-white hover:bg-black/50"
            onClick={() => handleManualNavigate((current - 1 + items.length) % items.length)}
          >
            <ChevronLeft />
          </Button>
          
          <Button
            size="icon"
            variant="outline"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 border-none text-white hover:bg-black/50"
            onClick={() => handleManualNavigate((current + 1) % items.length)}
          >
            <ChevronRight />
          </Button>
        </>
      )}
      
      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={item.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          {/* Background image */}
          <div className="relative w-full h-full">
            <img
              src={item.thumbnail || "/placeholder.svg"}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
          </div>
          
          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <Badge className="mb-3 text-xs uppercase tracking-wide bg-primary/80">
              Featured
            </Badge>
            
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">
              {item.title}
            </h2>
            
            <p className="text-sm md:text-base text-gray-200 mb-6 line-clamp-2 md:line-clamp-3 max-w-2xl">
              {item.description}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button 
                className="gap-2 bg-primary hover:bg-primary/90" 
                onClick={() => onSelect(item)}
              >
                <Play size={16} />
                Watch Now
              </Button>
              
              {item.format === 'course' && (
                <div className="flex items-center text-white">
                  <Badge variant="outline" className="border-white/40 text-white">
                    Course
                  </Badge>
                </div>
              )}
              
              {(item.access_level === 'premium' || item.accessLevel === 'premium') && (
                <Badge className="bg-amber-500 text-white">
                  <Lock size={12} className="mr-1" />
                  Premium
                </Badge>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Indicators */}
      {items.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {items.map((_, i) => (
            <button
              key={i}
              className={`w-2 h-2 rounded-full ${
                i === current ? 'bg-white' : 'bg-white/40'
              }`}
              onClick={() => handleManualNavigate(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeaturedContentCarousel;
