
import React from 'react';
import { ContentItem } from '@/types/library';
import { Play, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import PremiumContentOverlay from '../PremiumContentOverlay';

interface ContentCardMediaProps {
  item: ContentItem;
  isHovered: boolean;
  isPremium: boolean;
}

const ContentCardMedia: React.FC<ContentCardMediaProps> = ({ 
  item, 
  isHovered, 
  isPremium 
}) => {
  return (
    <div className="relative aspect-video overflow-hidden rounded-t-lg">
      <img 
        src={item.thumbnailUrl || item.thumbnail || '/placeholder.svg'} 
        alt={item.title}
        className={`w-full h-full object-cover transition-all duration-300 ${
          isHovered ? 'scale-105 brightness-40' : isPremium ? 'brightness-75' : 'brightness-90'
        }`}
      />
      
      {/* Content format badge - positioned at top left */}
      <div className="absolute top-2 left-2 z-10">
        <Badge variant="secondary" className="bg-black/70 text-white border-none font-medium">
          {item.format.charAt(0).toUpperCase() + item.format.slice(1)}
        </Badge>
      </div>
      
      {/* "New" badge - positioned at top right, only if item is new */}
      {item.isNew && (
        <div className="absolute top-2 right-2 z-10">
          <Badge className="bg-purple-600 text-white border-none">
            New
          </Badge>
        </div>
      )}
      
      {/* Premium content overlay when not hovered */}
      {isPremium && !isHovered && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-black/70 to-black/30">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="w-10 h-10 bg-amber-500/90 rounded-full flex items-center justify-center mb-2 shadow-md"
          >
            <Lock className="h-5 w-5 text-white" />
          </motion.div>
          <motion.div
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-white border-none shadow-md">
              Premium
            </Badge>
          </motion.div>
        </div>
      )}
      
      {/* Play button overlay for videos (visible when not hovered) */}
      {['video', 'youtube', 'vimeo'].includes(item.format) && !isHovered && !isPremium && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg">
            <Play className="text-white ml-1" size={24} />
          </div>
        </div>
      )}

      {/* Free access badge if applicable */}
      {isPremium && item.freeAccessesLeft && item.freeAccessesLeft > 0 && !isHovered && (
        <div className="absolute bottom-2 right-2">
          <Badge className="bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-md">
            {item.freeAccessesLeft} Free {item.freeAccessesLeft === 1 ? 'Access' : 'Accesses'}
          </Badge>
        </div>
      )}
    </div>
  );
};

export default ContentCardMedia;
