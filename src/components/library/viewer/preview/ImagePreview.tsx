
import React, { useState } from 'react';
import { ContentItem } from '@/types/library';
import { Maximize, Minimize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PremiumContentOverlay from '../../PremiumContentOverlay';

interface ImagePreviewProps {
  item: ContentItem;
  onContentView: () => void;
  handleAccess: () => void;
  isFullscreen?: boolean;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ 
  item, 
  onContentView, 
  handleAccess, 
  isFullscreen = false 
}) => {
  const [localFullscreen, setLocalFullscreen] = useState(isFullscreen);
  const isPremium = item.accessLevel === 'premium';
  
  const toggleFullscreen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLocalFullscreen(!localFullscreen);
  };

  return (
    <div className={`${localFullscreen ? 'max-h-[70vh] flex justify-center relative' : 'relative'} mb-6 overflow-hidden`}>
      <img 
        src={item.resourceUrl || item.thumbnailUrl || '/placeholder.svg'} 
        alt={item.title} 
        className={`${localFullscreen ? 'max-h-[70vh] object-contain' : 'w-full'} rounded-lg`}
        onLoad={onContentView}
      />
      <Button 
        variant="secondary" 
        size="icon" 
        className="absolute bottom-4 right-4 opacity-80 hover:opacity-100"
        onClick={toggleFullscreen}
      >
        {localFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
      </Button>
      {isPremium && (
        <PremiumContentOverlay 
          pointsEnabled={item.pointsEnabled}
          pointsValue={item.pointsValue}
          freeAccessLeft={item.freeAccessesLeft}
          onSubscribe={handleAccess}
          onUsePoints={handleAccess}
        />
      )}
    </div>
  );
};

export default ImagePreview;
