
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
  isNew?: boolean;
}

const EnhancedContentCard: React.FC<EnhancedContentCardProps> = ({ 
  item, 
  onClick, 
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
        {isNew && (
          <Badge 
            className="absolute top-2 right-2 bg-green-500 text-white z-20 shadow-md border-none"
          >
            NEW
          </Badge>
        )}
        
        <ContentCardMedia 
          item={item} 
          isHovered={isHovered} 
          isPremium={isPremium} 
        />
        
        <div className={`transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
          <ContentCardInfo item={item} />
        </div>
        
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
