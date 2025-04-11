
import React, { useState } from 'react';
import { ContentItem } from '@/types/library';
import { Maximize, Minimize, Lock, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PremiumContentOverlay from '../../PremiumContentOverlay';
import { Progress } from '@/components/ui/progress';

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
  const [loadingProgress, setLoadingProgress] = useState(0);
  const isPremium = item.accessLevel === 'premium';
  
  const previewClass = localFullscreen 
    ? "w-full h-[70vh] bg-slate-100 dark:bg-slate-900 rounded-lg flex flex-col relative overflow-hidden"
    : "aspect-[3/2] bg-slate-100 dark:bg-slate-900 rounded-lg flex flex-col relative overflow-hidden";

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLocalFullscreen(!localFullscreen);
  };

  // Simulate loading progress
  React.useEffect(() => {
    if (item.accessLevel === 'free' && item.resourceUrl) {
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

  if (item.accessLevel === 'free' && item.resourceUrl) {
    return (
      <div className={previewClass}>
        {loadingProgress < 100 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 z-10">
            <FileText size={48} className="mb-4 text-primary animate-pulse" />
            <h3 className="text-lg font-medium mb-3">Carregando documento...</h3>
            <div className="w-64">
              <Progress value={loadingProgress} className="h-2" />
            </div>
          </div>
        )}
        
        <iframe 
          src={getEmbedUrl(item.resourceUrl)}
          className="w-full h-full rounded-lg"
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
