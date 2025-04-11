
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ContentItem } from '@/types/library';
import { Play, Lock, FileText, Download, Eye, Clock, Calendar } from 'lucide-react';

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
  
  return (
    <Card 
      className="overflow-hidden border-none shadow-md group cursor-pointer transition-all duration-300 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={item.thumbnailUrl || '/placeholder.svg'} 
          alt={item.title}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        />
        
        {/* Overlay on hover */}
        <div className={`absolute inset-0 bg-black/70 flex flex-col justify-between p-4 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="flex justify-between">
            <Badge className="bg-nortech-purple text-white">
              {item.format.toUpperCase()}
            </Badge>
            
            {item.accessLevel === 'premium' && (
              <Badge variant="outline" className="border-amber-500 text-amber-500">
                <Lock className="mr-1 h-3 w-3" /> Premium
              </Badge>
            )}
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-1">{item.title}</h3>
            <p className="text-white/80 text-sm line-clamp-2 mb-3">{item.description}</p>
            
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
        
        {/* Play button overlay for videos */}
        {['video', 'youtube', 'vimeo'].includes(item.format) && !isHovered && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-12 h-12 bg-nortech-purple rounded-full flex items-center justify-center">
              <Play className="text-white ml-1" size={24} />
            </div>
          </div>
        )}
        
        {/* Premium overlay for locked content */}
        {item.accessLevel === 'premium' && !isHovered && (
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-amber-500 text-white">
              <Lock size={12} className="mr-1" /> Premium
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
  );
};

export default EnhancedContentCard;
