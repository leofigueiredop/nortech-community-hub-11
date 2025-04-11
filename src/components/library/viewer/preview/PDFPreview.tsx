
import React from 'react';
import { ContentItem } from '@/types/library';
import { Button } from '@/components/ui/button';
import { File, Download, ExternalLink, Lock } from 'lucide-react';
import PremiumContentOverlay from '../../PremiumContentOverlay';

interface PDFPreviewProps {
  item: ContentItem;
  onContentView: () => void;
  handleAccess: () => void;
  isFullscreen?: boolean;
  getEmbedUrl: (url: string) => string;
}

const PDFPreview: React.FC<PDFPreviewProps> = ({ 
  item, 
  onContentView, 
  handleAccess, 
  isFullscreen = false,
  getEmbedUrl
}) => {
  const isPremium = item.accessLevel === 'premium';

  if (item.accessLevel === 'free' && 
      (item.resourceUrl.endsWith('.pdf') || item.resourceUrl.includes('drive.google.com'))) {
    return (
      <div className={`${isFullscreen ? 'h-[70vh]' : 'aspect-[3/4]'} bg-slate-100 dark:bg-slate-800 rounded-lg mb-6 relative overflow-hidden`}>
        <iframe 
          src={getEmbedUrl(item.resourceUrl)}
          className="w-full h-full rounded-lg"
          title={item.title}
          onLoad={onContentView}
        />
      </div>
    );
  }
  
  return (
    <div className={`${isFullscreen ? 'h-[70vh]' : 'aspect-[3/4]'} bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center mb-6 relative overflow-hidden`}>
      <div className="text-center">
        <File size={48} className="mx-auto mb-2 text-muted-foreground" />
        <p className="text-muted-foreground">PDF preview not available</p>
        <div className="mt-4 space-y-2">
          <Button onClick={handleAccess} className="w-full">
            <Download className="mr-2 h-4 w-4" /> Download PDF
          </Button>
          <Button variant="outline" onClick={handleAccess} className="w-full">
            <ExternalLink className="mr-2 h-4 w-4" /> View in Browser
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

export default PDFPreview;
