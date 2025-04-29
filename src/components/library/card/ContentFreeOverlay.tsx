
import React from 'react';
import { ContentItem } from '@/types/library';
import { useContentProgress } from '@/hooks/useContentProgress';
import { Button } from '@/components/ui/button';
import { CheckCircle, Lock } from 'lucide-react';

interface ContentFreeOverlayProps {
  item: ContentItem;
  onUnlock?: () => void;
}

const ContentFreeOverlay: React.FC<ContentFreeOverlayProps> = ({ item, onUnlock }) => {
  const { getProgress } = useContentProgress();
  const progress = getProgress(item.id);
  const isCompleted = progress?.completed_at !== null;
  const hasProgress = progress?.progress_percent > 0;
  
  // Free content doesn't need an overlay
  if (item.access_level === 'free') return null;
  
  return (
    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent/25 flex flex-col items-center justify-center p-4 text-center">
      {item.access_level === 'premium' || item.access_level === 'premium_plus' ? (
        <>
          <Lock className="w-12 h-12 text-white mb-3" />
          <h3 className="text-white font-bold mb-1">Premium Content</h3>
          <p className="text-white/80 text-sm mb-4">Upgrade to access this content</p>
          <Button variant="outline" className="bg-white text-black hover:bg-white/90">
            Upgrade Now
          </Button>
        </>
      ) : item.access_level === 'unlockable' ? (
        <>
          {isCompleted ? (
            <div className="flex flex-col items-center">
              <CheckCircle className="w-12 h-12 text-green-500 mb-3" />
              <h3 className="text-white font-bold">Completed</h3>
              {hasProgress && <p className="text-white/80 text-sm">{progress.progress_percent}% complete</p>}
            </div>
          ) : (
            <>
              <Lock className="w-12 h-12 text-white mb-3" />
              <h3 className="text-white font-bold mb-1">Unlock with Points</h3>
              <p className="text-white/80 text-sm mb-4">Use {item.points_value || 0} points to access</p>
              <Button onClick={onUnlock}>
                Unlock Now
              </Button>
            </>
          )}
        </>
      ) : null}
    </div>
  );
};

export default ContentFreeOverlay;
