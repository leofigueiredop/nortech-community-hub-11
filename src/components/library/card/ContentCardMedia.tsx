
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
    <div className="relative aspect-video overflow-hidden">
      <img 
        src={item.thumbnailUrl || '/placeholder.svg'} 
        alt={item.title}
        className={`w-full h-full object-cover transition-transform duration-500 ${
          isHovered ? 'scale-110' : 'scale-100'
        } ${
          isPremium && !isHovered ? 'brightness-50 blur-[2px]' : isHovered ? 'brightness-50' : 'brightness-100'
        }`}
      />
      
      {/* Premium content overlay when not hovered */}
      {isPremium && !isHovered && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 transition-opacity duration-300">
          <Lock className="h-10 w-10 text-amber-500 mb-2" />
          <Badge className="bg-amber-500 text-white border-none px-3 py-1 text-sm">
            Premium Content
          </Badge>
        </div>
      )}
      
      {/* Overlay on hover for premium content */}
      {isHovered && isPremium && (
        <div className="absolute inset-0">
          <PremiumContentOverlay
            pointsEnabled={item.pointsEnabled}
            pointsValue={item.pointsValue}
            freeAccessLeft={item.freeAccessesLeft}
            onSubscribe={() => {}}
            onUsePoints={() => {}}
          />
        </div>
      )}
      
      {/* Overlay on hover for free content */}
      {isHovered && !isPremium && (
        <ContentFreeOverlay item={item} />
      )}
      
      {/* Play button overlay for videos (visible when not hovered) */}
      {['video', 'youtube', 'vimeo'].includes(item.format) && !isHovered && !isPremium && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 bg-nortech-purple rounded-full flex items-center justify-center">
            <Play className="text-white ml-1" size={24} />
          </div>
        </div>
      )}
      
      {/* Premium badge for locked content (when not hovered) */}
      {isPremium && !isHovered && (
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-amber-500 text-white">
            <Lock size={12} className="mr-1" /> Premium
          </Badge>
        </div>
      )}

      {/* Free access badge if applicable */}
      {isPremium && item.freeAccessesLeft > 0 && !isHovered && (
        <div className="absolute bottom-2 right-2">
          <Badge className="bg-gradient-to-r from-amber-400 to-amber-500 text-white px-2 py-1 text-xs">
            {item.freeAccessesLeft} Free {item.freeAccessesLeft === 1 ? 'Access' : 'Accesses'} Left
          </Badge>
        </div>
      )}
    </div>
  );
};

export default ContentCardMedia;
