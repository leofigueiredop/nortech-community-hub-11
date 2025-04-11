
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
    initial: { boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" },
    hover: { 
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)",
      borderColor: "var(--nortech-purple)" // Apply purple highlight border
    }
  };
  
  const isPremium = item.accessLevel === 'premium';
  
  return (
    <motion.div
      initial="initial"
      animate={isHovered ? "hover" : "initial"}
      variants={cardVariants}
      className="h-full"
    >
      <Card 
        className="overflow-hidden border-2 transition-all duration-300 h-full cursor-pointer group relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => {
          if (!isHovered) {
            // On mobile, first tap shows hover state
            setIsHovered(true);
            // Add a small delay before allowing the actual click to happen on second tap
            setTimeout(() => {
              const isMobile = window.innerWidth < 768;
              if (!isMobile) onClick();
            }, 50);
          } else {
            onClick();
          }
        }}
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
