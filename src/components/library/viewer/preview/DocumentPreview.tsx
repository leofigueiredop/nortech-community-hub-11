
import React, { useState } from 'react';
import { ContentItem } from '@/types/library';
import { Maximize, Minimize } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  const [localFullscreen, setLocalFullscreen] = useState(isFullscreen);
  const isPremium = item.accessLevel === 'premium';
  const previewClass = localFullscreen 
    ? "w-full max-h-[70vh] bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center mb-6 relative overflow-hidden"
    : "aspect-video bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center mb-6 relative overflow-hidden";

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLocalFullscreen(!localFullscreen);
  };

  if (item.accessLevel === 'free' && item.resourceUrl) {
    return (
      <div className={previewClass}>
        <iframe 
          src={getEmbedUrl(item.resourceUrl)}
          className="w-full h-full rounded-lg"
          title={item.title}
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
      </div>
    );
  }
  
  return (
    <div className={previewClass}>
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
