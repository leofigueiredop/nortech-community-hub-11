
import React from 'react';
import { ContentItem } from '@/types/library';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, FileText, Music, Download, ExternalLink, BookOpen } from 'lucide-react';
import { ContentFormatIcon } from '../management/utils/ContentFormatIcon';

interface ContentFreeOverlayProps {
  item: ContentItem;
}

const ContentFreeOverlay: React.FC<ContentFreeOverlayProps> = ({ item }) => {
  // Get the appropriate CTA based on content format
  const getCTA = () => {
    switch (item.format) {
      case 'video':
      case 'youtube':
      case 'vimeo':
        return (
          <Button size="sm" className="bg-primary/90 hover:bg-primary text-white">
            <Play size={16} className="mr-2" /> Watch Now
          </Button>
        );
      case 'pdf':
      case 'text':
      case 'gdoc':
        return (
          <Button size="sm" className="bg-primary/90 hover:bg-primary text-white">
            <FileText size={16} className="mr-2" /> Read Now
          </Button>
        );
      case 'audio':
        return (
          <Button size="sm" className="bg-primary/90 hover:bg-primary text-white">
            <Music size={16} className="mr-2" /> Listen Now
          </Button>
        );
      case 'course':
        return (
          <Button size="sm" className="bg-primary/90 hover:bg-primary text-white">
            <BookOpen size={16} className="mr-2" /> Start Course
          </Button>
        );
      default:
        return (
          <Button size="sm" className="bg-primary/90 hover:bg-primary text-white">
            <ExternalLink size={16} className="mr-2" /> View Now
          </Button>
        );
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col justify-between p-3 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
      {/* Content description and info shown on hover */}
      <div className="mt-auto">
        <motion.h3 
          className="text-sm font-semibold text-white mb-1 line-clamp-1"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {item.title}
        </motion.h3>
        
        <motion.p 
          className="text-xs text-white/80 mb-3 line-clamp-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          {item.description}
        </motion.p>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.2 }}
        >
          {getCTA()}
        </motion.div>
      </div>
    </div>
  );
};

export default ContentFreeOverlay;
