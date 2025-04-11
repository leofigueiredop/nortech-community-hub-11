
import React, { useState } from 'react';
import { ContentItem } from '@/types/library';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Play, Lock, FileText, Download, Clock, Eye } from 'lucide-react';

interface ContentRowProps {
  items: ContentItem[];
  onItemSelect: (item: ContentItem) => void;
}

const ContentRow: React.FC<ContentRowProps> = ({ items, onItemSelect }) => {
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

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

  return (
    <div className="relative group">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-4 pb-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="relative flex-none w-[250px] transition-transform duration-300 hover:scale-105 hover:z-10"
              onMouseEnter={() => setHoveredItemId(item.id)}
              onMouseLeave={() => setHoveredItemId(null)}
              onClick={() => onItemSelect(item)}
            >
              <div className="relative h-[140px] rounded-md overflow-hidden cursor-pointer">
                <img
                  src={item.thumbnailUrl || '/placeholder.svg'}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Hover overlay */}
                {hoveredItemId === item.id && (
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
                      <Button 
                        size="sm"
                        className="w-full mt-2 bg-nortech-purple hover:bg-nortech-purple/90 text-xs py-1"
                      >
                        {getActionText(item.format)} Now
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
              
              {/* Title when not hovered */}
              {hoveredItemId !== item.id && (
                <div className="mt-2">
                  <h3 className="text-sm font-medium line-clamp-1">{item.title}</h3>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <Eye className="h-3 w-3 mr-1" />
                    <span>{item.views} views</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default ContentRow;
