
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ContentItem } from '@/types/library';
import { motion } from 'framer-motion';
import ContentCardMedia from './card/ContentCardMedia';
import ContentCardInfo from './card/ContentCardInfo';
import ContentFreeOverlay from './card/ContentFreeOverlay';
import PremiumContentOverlay from './PremiumContentOverlay';
import { Badge } from '@/components/ui/badge';

interface EnhancedContentCardProps {
  item: ContentItem;
  onClick: () => void;
  rankNumber?: number;
  isNew?: boolean;
}

const EnhancedContentCard: React.FC<EnhancedContentCardProps> = ({ 
  item, 
  onClick, 
  rankNumber,
  isNew = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const cardVariants = {
    initial: { scale: 1, zIndex: 1 },
    hover: { 
      scale: 1.05, 
      zIndex: 10,
      transition: { duration: 0.2 }
    }
  };
  
  const isPremium = item.accessLevel === 'premium';
  
  return (
    <motion.div
      initial="initial"
      animate={isHovered ? "hover" : "initial"}
      variants={cardVariants}
      className="h-full cursor-pointer w-full relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setTimeout(() => setIsHovered(false), 500)}
    >
      <Card 
        className="overflow-hidden border border-border/40 h-full shadow-sm hover:shadow-md rounded-lg transition-all duration-200 flex flex-col"
        onClick={onClick}
      >
        {/* New badge */}
        {isNew && (
          <Badge 
            className="absolute top-2 right-2 bg-green-500 text-white z-20 shadow-md border-none"
          >
            NEW
          </Badge>
        )}
        
        {/* Rank number display for top 10 items */}
        {rankNumber !== undefined && (
          <div 
            className="absolute -left-1 -top-1 z-30 w-8 h-8 flex items-center justify-center bg-primary rounded-full text-white font-bold text-lg select-none pointer-events-none shadow-lg" 
          >
            {rankNumber}
          </div>
        )}
        
        <ContentCardMedia 
          item={item} 
          isHovered={isHovered} 
          isPremium={isPremium} 
        />
        
        {/* Content info below image (visible when not hovered) */}
        <div className={`transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
          <ContentCardInfo item={item} />
        </div>
        
        {/* Overlay with description and actions (visible when hovered) */}
        {isHovered && (
          <>
            {isPremium ? (
              <PremiumContentOverlay 
                pointsEnabled={item.pointsEnabled}
                pointsValue={item.pointsValue} 
                freeAccessLeft={item.freeAccessesLeft}
              />
            ) : (
              <ContentFreeOverlay item={item} />
            )}
          </>
        )}
      </Card>
    </motion.div>
  );
};

export default EnhancedContentCard;
