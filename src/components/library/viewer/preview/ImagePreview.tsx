
import React from 'react';
import { ContentItem } from '@/types/library';
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
  const isPremium = item.accessLevel === 'premium';

  return (
    <div className={`${isFullscreen ? 'max-h-[70vh] flex justify-center relative' : 'relative'} mb-6 overflow-hidden`}>
      <img 
        src={item.resourceUrl || item.thumbnailUrl || '/placeholder.svg'} 
        alt={item.title} 
        className={`${isFullscreen ? 'max-h-[70vh] object-contain' : 'w-full'} rounded-lg`}
        onLoad={onContentView}
      />
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
