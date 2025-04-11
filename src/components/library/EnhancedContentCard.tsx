
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ContentItem } from '@/types/library';
import { motion } from 'framer-motion';
import ContentCardMedia from './card/ContentCardMedia';
import ContentCardInfo from './card/ContentCardInfo';

interface EnhancedContentCardProps {
  item: ContentItem;
  onClick: () => void;
  rankNumber?: number; // New prop for top 10 ranking
}

const EnhancedContentCard: React.FC<EnhancedContentCardProps> = ({ 
  item, 
  onClick, 
  rankNumber 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Card variants for hover animation
  const cardVariants = {
    initial: { y: 0, scale: 1, zIndex: 0 },
    hover: { 
      y: -10, 
      scale: 1.05, 
      zIndex: 20,
      transition: { duration: 0.3 }
    }
  };
  
  const isPremium = item.accessLevel === 'premium';
  
  return (
    <motion.div
      initial="initial"
      animate={isHovered ? "hover" : "initial"}
      variants={cardVariants}
      className="h-full cursor-pointer"
    >
      <Card 
        className="overflow-hidden border border-border/40 transition-all duration-300 h-full group relative shadow-sm hover:shadow-xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
      >
        {/* Rank number display for top 10 items */}
        {rankNumber !== undefined && (
          <div className="absolute -left-4 -bottom-2 z-10 font-bold text-[90px] select-none" 
            style={{
              color: 'transparent',
              WebkitTextStroke: '2px rgba(255,255,255,0.7)',
              textShadow: '0 0 10px rgba(0,0,0,0.2)',
              opacity: isHovered ? 0.4 : 0.8,
              transition: 'opacity 0.3s ease'
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
      </Card>
    </motion.div>
  );
};

export default EnhancedContentCard;
