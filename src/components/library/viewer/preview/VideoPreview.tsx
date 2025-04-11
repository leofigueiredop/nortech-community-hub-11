
import React, { useState, useEffect } from 'react';
import { ContentItem } from '@/types/library';
import { Button } from '@/components/ui/button';
import { FileVideo, Video, Lock, Maximize, Minimize, Play } from 'lucide-react';
import PremiumContentOverlay from '../../PremiumContentOverlay';
import { Progress } from '@/components/ui/progress';

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
  const [localFullscreen, setLocalFullscreen] = useState(isFullscreen);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const isPremium = item.accessLevel === 'premium';
  const previewClass = localFullscreen 
    ? "w-full h-[70vh] bg-slate-900 rounded-lg flex flex-col relative overflow-hidden"
    : "aspect-video bg-slate-900 rounded-lg flex flex-col relative overflow-hidden";

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLocalFullscreen(!localFullscreen);
  };
  
  // Simulate video loading progress
  useEffect(() => {
    if (item.accessLevel === 'free' && 
      (item.resourceUrl?.includes('youtube.com') || 
       item.resourceUrl?.includes('youtu.be') || 
       item.resourceUrl?.includes('vimeo.com'))) {
      
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
      
      return () => clearInterval(interval);
    }
  }, [item.accessLevel, item.resourceUrl]);

  if (item.accessLevel === 'free' && 
      (item.resourceUrl?.includes('youtube.com') || 
      item.resourceUrl?.includes('youtu.be') || 
      item.resourceUrl?.includes('vimeo.com'))) {
    return (
      <div className={previewClass}>
        {loadingProgress < 100 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 z-10">
            <Play size={48} className="mb-4 text-primary animate-pulse" />
            <h3 className="text-lg font-medium mb-3">Carregando vídeo...</h3>
            <div className="w-64">
              <Progress value={loadingProgress} className="h-2" />
            </div>
          </div>
        )}
        
        <iframe 
          src={getEmbedUrl(item.resourceUrl || '')}
          className="w-full h-full rounded-lg"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={item.title}
          onLoad={() => {
            setLoadingProgress(100);
            onContentView();
          }}
        />
        
        <Button 
          variant="secondary" 
          size="icon" 
          className="absolute bottom-4 right-4 z-20 opacity-80 hover:opacity-100 shadow-md"
          onClick={toggleFullscreen}
        >
          {localFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
        </Button>
      </div>
    );
  }
  
  return (
    <div className={previewClass}>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-center p-6">
          <FileVideo size={48} className="mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">Video preview not available</p>
          <Button 
            onClick={handleAccess} 
            size="lg"
            variant="default"
            className="bg-primary hover:bg-primary/90"
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
