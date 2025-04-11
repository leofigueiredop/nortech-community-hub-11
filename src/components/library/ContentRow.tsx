
import React, { useState, useRef } from 'react';
import { ContentItem } from '@/types/library';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Play, Lock, FileText, Download, Clock, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

interface ContentRowProps {
  items: ContentItem[];
  onItemSelect: (item: ContentItem) => void;
  isTopTen?: boolean;
}

const ContentRow: React.FC<ContentRowProps> = ({ items, onItemSelect, isTopTen = false }) => {
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const [tappedItemId, setTappedItemId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -600, behavior: 'smooth' });
    }
  };
  
  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 600, behavior: 'smooth' });
    }
  };

  const getContentIcon = (format: string) => {
    switch (format) {
      case 'video':
      case 'youtube':
      case 'vimeo':
        return <Play className="h-8 w-8 text-white" />;
      case 'pdf':
      case 'text': 
      case 'gdoc':
        return <FileText className="h-8 w-8 text-white" />;
      default:
        return <Download className="h-8 w-8 text-white" />;
    }
  };

  const getActionText = (format: string) => {
    switch (format) {
      case 'video':
      case 'youtube':
      case 'vimeo':
        return 'Watch';
      case 'pdf':
      case 'text':
      case 'gdoc':
        return 'Read';
      case 'audio':
        return 'Listen';
      default:
        return 'View';
    }
  };

  // Handle mobile tap interaction
  const handleItemClick = (item: ContentItem) => {
    // On mobile, the first tap shows the hover state
    // The second tap triggers the actual action
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
      if (tappedItemId === item.id) {
        // Second tap - perform action
        onItemSelect(item);
        setTappedItemId(null);
      } else {
        // First tap - show hover state
        setTappedItemId(item.id);
        // Auto-reset tapped state after 5 seconds of inactivity
        setTimeout(() => setTappedItemId(null), 5000);
      }
    } else {
      // On desktop, clicking always performs the action
      onItemSelect(item);
    }
  };

  return (
    <div className="relative group">
      {/* Netflix-style side navigation arrows */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10 flex items-center justify-start opacity-0 group-hover:opacity-100 transition-opacity">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full bg-background/80 hover:bg-background w-10 h-10"
          onClick={scrollLeft}
        >
          <ChevronLeft />
        </Button>
      </div>
      
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10 flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full bg-background/80 hover:bg-background w-10 h-10"
          onClick={scrollRight}
        >
          <ChevronRight />
        </Button>
      </div>
      
      <ScrollArea className="w-full whitespace-nowrap">
        <div ref={scrollRef} className="flex space-x-4 pb-4">
          {items.map((item, index) => {
            const isHovered = hoveredItemId === item.id;
            const isTapped = tappedItemId === item.id;
            const showDetails = isHovered || isTapped;
            
            return (
              <motion.div
                key={item.id}
                className={`relative flex-none transition-all duration-300 ${
                  isTopTen ? 'w-[300px]' : 'w-[250px]'
                }`}
                whileHover={{ scale: 1.05, zIndex: 10 }}
                onMouseEnter={() => setHoveredItemId(item.id)}
                onMouseLeave={() => setHoveredItemId(null)}
                onClick={() => handleItemClick(item)}
              >
                {/* Top 10 number badge */}
                {isTopTen && (
                  <div className="absolute -left-4 -bottom-4 z-20 font-bold text-[90px] text-stroke-white text-transparent" style={{ textShadow: '-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff' }}>
                    {index + 1}
                  </div>
                )}

                <div 
                  className={`relative ${isTopTen ? 'h-[169px]' : 'h-[140px]'} rounded-md overflow-hidden cursor-pointer ${showDetails ? 'ring-2 ring-nortech-purple shadow-xl' : ''}`}
                >
                  <img
                    src={item.thumbnailUrl || '/placeholder.svg'}
                    alt={item.title}
                    className={`w-full h-full object-cover transition-all duration-300 ${showDetails ? 'brightness-50 scale-110' : ''}`}
                  />
                  
                  {/* Hover/tap overlay */}
                  {showDetails && (
                    <>
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-nortech-purple/90 flex items-center justify-center">
                          {getContentIcon(item.format)}
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
                        <h3 className="text-white font-medium line-clamp-1">{item.title}</h3>
                        <div className="flex items-center text-xs text-white/80 mt-1">
                          <span className="capitalize mr-2">{item.format}</span>
                          {item.duration && (
                            <span className="flex items-center mr-2">
                              <Clock className="h-3 w-3 mr-1" />
                              {item.duration}
                            </span>
                          )}
                        </div>
                        <p className="text-white/70 text-xs mt-1 line-clamp-3">{item.description}</p>
                        <Button 
                          size="sm"
                          className="w-full mt-2 bg-nortech-purple hover:bg-nortech-purple/90 text-xs py-1"
                        >
                          {item.accessLevel === 'premium' ? 'Subscribe to Unlock' : `${getActionText(item.format)} Now`}
                        </Button>
                      </div>
                    </>
                  )}
                  
                  {/* Premium badge */}
                  {item.accessLevel === 'premium' && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="bg-amber-500 text-white text-xs">
                        <Lock size={10} className="mr-1" /> Premium
                      </Badge>
                    </div>
                  )}
                </div>
                
                {/* Title when not hovered/tapped */}
                {!showDetails && (
                  <div className="mt-2">
                    <h3 className="text-sm font-medium line-clamp-1">{item.title}</h3>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <Eye className="h-3 w-3 mr-1" />
                      <span>{item.views} views</span>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default ContentRow;
