
import React from 'react';
import { ContentItem } from '@/types/library';
import PremiumContentOverlay from '../../PremiumContentOverlay';

interface DocumentPreviewProps {
  item: ContentItem;
  onContentView: () => void;
  handleAccess: () => void;
  isFullscreen?: boolean;
  getEmbedUrl: (url: string) => string;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ 
  item, 
  onContentView, 
  handleAccess, 
  isFullscreen = false,
  getEmbedUrl
}) => {
  const isPremium = item.accessLevel === 'premium';
  const previewClass = isFullscreen 
    ? "w-full max-h-[70vh] bg-slate-900 rounded-lg flex items-center justify-center mb-6 relative overflow-hidden"
    : "aspect-video bg-slate-900 rounded-lg flex items-center justify-center mb-6 relative overflow-hidden";

  return (
    <div className={previewClass}>
      <iframe 
        src={getEmbedUrl(item.resourceUrl)}
        className="w-full h-full rounded-lg"
        title={item.title}
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

export default DocumentPreview;
