
import React from 'react';
import { ContentItem } from '@/types/library';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, FileText, Download, ExternalLink, Music, BookOpen, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';

interface FeaturedContentCarouselProps {
  items: ContentItem[];
  onItemSelect: (item: ContentItem) => void;
}

const FeaturedContentCarousel: React.FC<FeaturedContentCarouselProps> = ({ 
  items, 
  onItemSelect 
}) => {
  const featuredItems = items.slice(0, 3); // Limit to 3 featured items
  
  if (featuredItems.length === 0) return null;
  
  const getActionButton = (item: ContentItem) => {
    switch (item.format) {
      case 'video':
      case 'youtube':
      case 'vimeo':
        return (
          <Button onClick={() => onItemSelect(item)} className="mr-2">
            <Play className="h-4 w-4 mr-2" /> Watch Now
          </Button>
        );
      case 'pdf':
      case 'text':
      case 'gdoc':
        return (
          <Button onClick={() => onItemSelect(item)} className="mr-2">
            <FileText className="h-4 w-4 mr-2" /> Read Now
          </Button>
        );
      case 'audio':
        return (
          <Button onClick={() => onItemSelect(item)} className="mr-2">
            <Music className="h-4 w-4 mr-2" /> Listen Now
          </Button>
        );
      case 'course':
        return (
          <Button onClick={() => onItemSelect(item)} className="mr-2">
            <BookOpen className="h-4 w-4 mr-2" /> Start Course
          </Button>
        );
      default:
        return (
          <Button onClick={() => onItemSelect(item)} className="mr-2">
            <ExternalLink className="h-4 w-4 mr-2" /> View Now
          </Button>
        );
    }
  };
  
  return (
    <div className="mb-12">
      <Carousel className="w-full">
        <CarouselContent>
          {featuredItems.map(item => (
            <CarouselItem key={item.id}>
              <div className="relative w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
                
                {/* Background image */}
                <img 
                  src={item.thumbnailUrl || item.thumbnail || '/placeholder.svg'} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Content overlay */}
                <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-12">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* Premium badge if applicable */}
                    {item.accessLevel === 'premium' && (
                      <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-white mb-4 border-none">
                        <Star className="h-3 w-3 mr-1 fill-current" /> PREMIUM
                      </Badge>
                    )}
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-2">
                      {item.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="secondary" className="bg-black/30 backdrop-blur-md">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    {/* Title */}
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow-md">
                      {item.title}
                    </h1>
                    
                    {/* Description - limited to 2 lines */}
                    <p className="text-lg text-white/90 mb-6 line-clamp-2 max-w-2xl">
                      {item.description}
                    </p>
                    
                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-2">
                      {getActionButton(item)}
                      
                      {item.accessLevel === 'premium' && (
                        <Button variant="outline" className="bg-black/20 backdrop-blur-md border-white/30 text-white hover:bg-white/20">
                          <Download className="h-4 w-4 mr-2" /> Download
                        </Button>
                      )}
                      
                      <Button 
                        variant="outline" 
                        className="bg-black/20 backdrop-blur-md border-white/30 text-white hover:bg-white/20"
                        onClick={() => onItemSelect(item)}
                      >
                        More Info
                      </Button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute right-4 bottom-4 z-30 flex gap-2">
          <CarouselPrevious className="relative bg-black/50 backdrop-blur-md border-white/20 hover:bg-white/20 text-white" />
          <CarouselNext className="relative bg-black/50 backdrop-blur-md border-white/20 hover:bg-white/20 text-white" />
        </div>
      </Carousel>
    </div>
  );
};

export default FeaturedContentCarousel;
