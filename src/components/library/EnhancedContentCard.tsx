
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ContentItem } from '@/types/library';
import { motion } from 'framer-motion';
import ContentCardMedia from './card/ContentCardMedia';
import ContentCardInfo from './card/ContentCardInfo';

interface EnhancedContentCardProps {
  item: ContentItem;
  onClick: () => void;
}

const EnhancedContentCard: React.FC<EnhancedContentCardProps> = ({ item, onClick }) => {
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
