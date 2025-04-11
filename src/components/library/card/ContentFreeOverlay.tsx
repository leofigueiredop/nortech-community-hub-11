
import React from 'react';
import { ContentItem } from '@/types/library';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
import { Play, FileText, Headphones, Eye, ExternalLink, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { ContentFormatIcon } from '../management/utils/ContentFormatIcon';

interface ContentFreeOverlayProps {
  item: ContentItem;
}

const ContentFreeOverlay: React.FC<ContentFreeOverlayProps> = ({ item }) => {
  // Function to get appropriate button content based on format
  const getActionButton = () => {
    if (['video', 'youtube', 'vimeo'].includes(item.format)) {
      return (
        <Button className="bg-primary hover:bg-primary/90">
          <Play className="mr-2 h-4 w-4" /> Watch Now
        </Button>
      );
    } else if (item.format === 'audio') {
      return (
        <Button className="bg-primary hover:bg-primary/90">
          <Headphones className="mr-2 h-4 w-4" /> Listen Now
        </Button>
      );
    } else if (['pdf', 'text', 'gdoc'].includes(item.format)) {
      return (
        <Button className="bg-primary hover:bg-primary/90">
          <Eye className="mr-2 h-4 w-4" /> Read Now
        </Button>
      );
    } else {
      return (
        <Button className="bg-primary hover:bg-primary/90">
          <ExternalLink className="mr-2 h-4 w-4" /> Access
        </Button>
      );
    }
  };

  return (
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex flex-col items-center justify-center p-4 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full flex flex-col items-center space-y-3"
      >
        {/* Format icon */}
        <div className="bg-black/30 p-2 rounded-full backdrop-blur-sm mb-2">
          <ContentFormatIcon format={item.format} size={24} className="text-white" />
        </div>
        
        {/* Short description (truncated) */}
        <p className="text-sm text-center line-clamp-2 mb-2 max-w-xs">
          {item.description}
        </p>
        
        {/* Action button based on content format */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {getActionButton()}
        </motion.div>
        
        {/* Additional info */}
        <div className="mt-2 flex items-center text-xs opacity-80">
          <Eye size={12} className="mr-1" />
          {item.views} views
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full ml-2">
                <Info size={12} />
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 p-4">
              <div className="flex justify-between space-x-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">{item.title}</h4>
                  <p className="text-xs">{item.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.tags.map(tag => (
                      <span key={tag} className="text-xs bg-muted px-1.5 py-0.5 rounded-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </motion.div>
    </div>
  );
};

export default ContentFreeOverlay;
