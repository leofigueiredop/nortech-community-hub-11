
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ContentItem } from '@/types/library';
import { Play, Lock, FileText, Download, Eye, Clock, Calendar, Crown, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import PremiumContentOverlay from './PremiumContentOverlay';

interface EnhancedContentCardProps {
  item: ContentItem;
  onClick: () => void;
}

const EnhancedContentCard: React.FC<EnhancedContentCardProps> = ({ item, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const getContentIcon = (format: string) => {
    switch (format) {
      case 'video':
      case 'youtube':
      case 'vimeo':
        return <Play className="h-8 w-8 text-white" />;
      case 'pdf':
      case 'text':
      case 'gdoc':
        return <FileText className="h-8 w-8 text-white" />;
      default:
        return <Download className="h-8 w-8 text-white" />;
    }
  };

  const getActionText = (format: string) => {
    switch (format) {
      case 'video':
      case 'youtube':
      case 'vimeo':
        return 'Watch';
      case 'pdf':
      case 'text':
      case 'gdoc':
        return 'Read';
      case 'audio':
        return 'Listen';
      default:
        return 'View';
    }
  };
  
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
                onSubscribe={onClick}
                onUsePoints={onClick}
              />
            </div>
          )}
          
          {/* Overlay on hover for free content */}
          {isHovered && !isPremium && (
            <div className="absolute inset-0 bg-black/70 flex flex-col justify-between p-4 transition-opacity duration-300">
              <div className="flex justify-between">
                <Badge className="bg-nortech-purple text-white">
                  {item.format.toUpperCase()}
                </Badge>
              </div>
              
              <div>
                <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                <p className="text-white/80 text-sm line-clamp-3 mb-3">{item.description}</p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {item.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="outline" className="border-white/30 text-white/80 text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <Button 
                  className="w-full bg-nortech-purple hover:bg-nortech-purple/90"
                  size="sm"
                >
                  {getActionText(item.format)} Now
                </Button>
              </div>
            </div>
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
        
        {/* Content info below image (visible when not hovered) */}
        <div className={`p-3 transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
          <h3 className="font-medium text-base line-clamp-1">{item.title}</h3>
          
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <span className="capitalize mr-2">{item.format}</span>
            <span className="flex items-center">
              <Eye className="h-3 w-3 mr-1" />
              {item.views}
            </span>
            {item.duration && (
              <span className="flex items-center ml-2">
                <Clock className="h-3 w-3 mr-1" />
                {item.duration}
              </span>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default EnhancedContentCard;
