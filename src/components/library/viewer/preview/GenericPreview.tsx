
import React from 'react';
import { ContentItem } from '@/types/library';
import { Button } from '@/components/ui/button';
import { FileText, Lock, ExternalLink } from 'lucide-react';
import PremiumContentOverlay from '../../PremiumContentOverlay';

interface GenericPreviewProps {
  item: ContentItem;
  onContentView: () => void;
  handleAccess: () => void;
  isFullscreen?: boolean;
}

const GenericPreview: React.FC<GenericPreviewProps> = ({ 
  item, 
  onContentView, 
  handleAccess, 
  isFullscreen = false 
}) => {
  const isPremium = item.accessLevel === 'premium';

  return (
    <div className={`${isFullscreen ? 'h-[70vh]' : 'aspect-video'} bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center mb-6 relative overflow-hidden`}>
      <div className="text-center">
        <FileText size={48} className="mx-auto mb-2 text-muted-foreground" />
        <p className="text-muted-foreground">Preview not available</p>
        <Button 
          onClick={handleAccess} 
          className="mt-4"
        >
          {isPremium ? (
            <>
              <Lock className="mr-2 h-4 w-4" /> Unlock Premium Content
            </>
          ) : (
            <>
              <ExternalLink className="mr-2 h-4 w-4" /> Access Content
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

export default GenericPreview;
