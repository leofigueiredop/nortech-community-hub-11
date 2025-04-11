
import React from 'react';
import { ContentItem } from '@/types/library';
import { Button } from '@/components/ui/button';
import { FileVideo, Video, Lock } from 'lucide-react';
import PremiumContentOverlay from '../../PremiumContentOverlay';

interface VideoPreviewProps {
  item: ContentItem;
  onContentView: () => void;
  handleAccess: () => void;
  isFullscreen?: boolean;
  getEmbedUrl: (url: string) => string;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ 
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

  if (item.resourceUrl.includes('youtube.com') || 
      item.resourceUrl.includes('youtu.be') || 
      item.resourceUrl.includes('vimeo.com')) {
    return (
      <div className={previewClass}>
        <iframe 
          src={getEmbedUrl(item.resourceUrl)}
          className="w-full h-full rounded-lg"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
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
  }
  
  return (
    <div className={previewClass}>
      <div className="text-center">
        <FileVideo size={48} className="mx-auto mb-2 text-muted-foreground" />
        <p className="text-muted-foreground">Video preview not available</p>
        <Button 
          onClick={handleAccess} 
          className="mt-4"
        >
          {isPremium ? (
            <>
              <Lock className="mr-2 h-4 w-4" /> Unlock Premium Video
            </>
          ) : (
            <>
              <Video className="mr-2 h-4 w-4" /> Watch Video
            </>
          )}
        </Button>
      </div>
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

export default VideoPreview;
