
import React from 'react';
import { ContentItem } from '@/types/library';
import { Play, Download, FileText, BookOpen, Headphones, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContentFormatIcon } from '../management/utils/ContentFormatIcon';
import { motion } from 'framer-motion';

interface ContentFreeOverlayProps {
  item: ContentItem;
}

const ContentFreeOverlay: React.FC<ContentFreeOverlayProps> = ({ item }) => {
  const getContentIcon = (format: string) => {
    switch (format) {
      case 'video':
      case 'youtube':
      case 'vimeo':
        return <Play className="h-10 w-10 text-white" />;
      case 'pdf':
      case 'text':
      case 'gdoc':
        return <FileText className="h-10 w-10 text-white" />;
      case 'course':
        return <BookOpen className="h-10 w-10 text-white" />;
      case 'audio': 
        return <Headphones className="h-10 w-10 text-white" />;
      case 'image':
        return <Image className="h-10 w-10 text-white" />;
      default:
        return <Download className="h-10 w-10 text-white" />;
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
      case 'course':
        return 'Start Course';
      case 'image':
        return 'View Image';
      default:
        return 'View Now';
    }
  };

  const overlayVariants = {
    hover: { 
      opacity: 1,
      transition: { duration: 0.2 }
    },
    initial: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const iconVariants = {
    hover: { 
      scale: 1.1,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    initial: { 
      scale: 1,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 transition-opacity duration-300"
      variants={overlayVariants}
      initial="initial"
      animate="hover"
    >
      <motion.div 
        className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4"
        variants={iconVariants}
        whileHover="hover"
        initial="initial"
      >
        {getContentIcon(item.format)}
      </motion.div>
      <Button 
        className="bg-primary hover:bg-primary/90 text-white font-medium px-6"
      >
        {getActionText(item.format)}
      </Button>
    </motion.div>
  );
};

export default ContentFreeOverlay;
