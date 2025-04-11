
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ContentItem } from '@/types/library';
import { motion } from 'framer-motion';
import ContentCardMedia from './card/ContentCardMedia';
import ContentCardInfo from './card/ContentCardInfo';
import ContentFreeOverlay from './card/ContentFreeOverlay';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';

interface EnhancedContentCardProps {
  item: ContentItem;
  onClick: () => void;
  rankNumber?: number; // For top 10 ranking
}

const EnhancedContentCard: React.FC<EnhancedContentCardProps> = ({ 
  item, 
  onClick, 
  rankNumber 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Enhanced card variants for more elegant hover animation
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
      className="h-full cursor-pointer w-full relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card 
        className="overflow-hidden border-0 h-full shadow-md rounded-xl transition-all duration-200"
        onClick={onClick}
      >
        {/* Rank number display for top 10 items */}
        {rankNumber !== undefined && (
          <div className="absolute -left-2 -top-2 z-10 font-bold text-6xl select-none" 
            style={{
              color: 'white',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
            }}>
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
          <ContentFreeOverlay item={item} />
        )}
      </Card>
    </motion.div>
  );
};

export default EnhancedContentCard;
