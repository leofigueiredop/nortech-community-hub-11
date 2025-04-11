
import React, { useState } from 'react';
import { ContentItem } from '@/types/library';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from '@/components/ui/carousel';
import { Calendar, Clock, Eye, Lock, Play, Download, FileText } from 'lucide-react';

interface FeaturedContentCarouselProps {
  items: ContentItem[];
  onItemSelect: (item: ContentItem) => void;
}

const FeaturedContentCarousel: React.FC<FeaturedContentCarouselProps> = ({ items, onItemSelect }) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  if (items.length === 0) return null;

  const getContentTypeIcon = (format: string) => {
    switch (format) {
      case 'video':
      case 'youtube':
      case 'vimeo':
        return <Play className="mr-1 h-4 w-4" />;
      case 'pdf':
      case 'text':
      case 'gdoc':
        return <FileText className="mr-1 h-4 w-4" />;
      case 'audio':
        return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 h-4 w-4"><path d="M18 8a6 6 0 0 0-9.33-5"></path><path d="M18 16a6 6 0 0 1-9.33 5"></path><circle cx="6" cy="12" r="4"></circle></svg>;
      default:
        return <Download className="mr-1 h-4 w-4" />;
    }
  };

  const getActionText = (format: string) => {
    switch (format) {
      case 'video':
      case 'youtube':
      case 'vimeo':
        return 'Watch Now';
      case 'pdf':
      case 'text':
      case 'gdoc':
        return 'Read Now';
      case 'audio':
        return 'Listen Now';
      default:
        return 'View Now';
    }
  };

  return (
    <div className="mb-16">
      <Carousel className="w-full">
        <CarouselContent>
          {items.map((item) => (
            <CarouselItem key={item.id}>
              <div 
                className="relative aspect-[21/9] overflow-hidden rounded-xl"
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {/* Image with overlay */}
                <div className="absolute inset-0">
                  <img 
                    src={item.thumbnailUrl || '/placeholder.svg'} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                </div>

                {/* Featured badge */}
                <div className="absolute top-4 left-4">
                  <Badge className="bg-nortech-purple text-white">
                    Featured
                  </Badge>
                  
                  {item.accessLevel === 'premium' && (
                    <Badge variant="outline" className="ml-2 border-amber-500 text-amber-500 bg-black/50">
                      <Lock className="mr-1 h-3 w-3" /> Premium
                    </Badge>
                  )}
                </div>

                {/* Content info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center text-sm mb-2">
                    {getContentTypeIcon(item.format)}
                    <span className="uppercase text-xs font-medium tracking-wider mr-3">
                      {item.format}
                    </span>
                    
                    {item.duration && (
                      <span className="flex items-center text-xs mr-3">
                        <Clock className="mr-1 h-3 w-3" />
                        {item.duration}
                      </span>
                    )}
                    
                    <span className="flex items-center text-xs">
                      <Eye className="mr-1 h-3 w-3" />
                      {item.views} views
                    </span>
                  </div>
                  
                  <h2 className="text-2xl md:text-4xl font-bold mb-2">{item.title}</h2>
                  
                  <p className={`text-sm text-gray-300 mb-4 line-clamp-2 transition-all duration-300 ${
                    hoveredItem === item.id ? 'line-clamp-3' : 'line-clamp-2'
                  }`}>
                    {item.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="secondary" className="bg-white/10 hover:bg-white/20 text-white">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button 
                    onClick={() => onItemSelect(item)}
                    className="bg-nortech-purple hover:bg-nortech-purple/90"
                  >
                    {getContentTypeIcon(item.format)}
                    {getActionText(item.format)}
                  </Button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center gap-2 mt-4">
          <CarouselPrevious className="relative static left-0 translate-y-0 rounded-full" />
          <CarouselNext className="relative static right-0 translate-y-0 rounded-full" />
        </div>
      </Carousel>
    </div>
  );
};

export default FeaturedContentCarousel;
