
import React, { useEffect, useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ExternalLink, Lock } from 'lucide-react';
import { ContentItem } from '@/types/library';
import { toast } from '@/hooks/use-toast';
import { usePoints } from '@/context/PointsContext';
import ContentPreview from './viewer/ContentPreview';
import ContentDetails from './viewer/ContentDetails';
import ContentProgress from './viewer/ContentProgress';
import ContentHeader from './viewer/ContentHeader';
import { handleExternalContentAccess } from './viewer/contentViewerUtils';

interface ContentViewerProps {
  item: ContentItem | null;
  onClose: () => void;
}

const ContentViewer: React.FC<ContentViewerProps> = ({ item, onClose }) => {
  const { awardPoints } = usePoints();
  const [progress, setProgress] = useState(0);
  const [pointsAwarded, setPointsAwarded] = useState(false);
  const timeSpentRef = useRef(0);
  const intervalRef = useRef<number | null>(null);
  
  useEffect(() => {
    if (item) {
      setProgress(0);
      setPointsAwarded(false);
      timeSpentRef.current = 0;
      
      intervalRef.current = window.setInterval(() => {
        timeSpentRef.current += 1;
        
        if (item.completionCriteria === 'time_spent' && item.completionThreshold) {
          const newProgress = Math.min(Math.floor((timeSpentRef.current / item.completionThreshold) * 100), 100);
          setProgress(newProgress);
          
          if (newProgress >= 100 && !pointsAwarded && item.pointsEnabled) {
            awardPoints({
              type: 'content_completion',
              description: `Completed "${item.title}"`,
              points: item.pointsValue
            });
            setPointsAwarded(true);
            
            toast({
              title: "Points Awarded!",
              description: `You earned ${item.pointsValue} points for completing this content.`,
              variant: "default",
            });
          }
        }
      }, 1000);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [item, awardPoints]);
  
  const handleContentView = () => {
    if (!item || pointsAwarded || !item.pointsEnabled) return;
    
    if (item.completionCriteria === 'view' || !item.completionCriteria) {
      awardPoints({
        type: 'content_view',
        description: `Viewed "${item.title}"`,
        points: item.pointsValue
      });
      setPointsAwarded(true);
      setProgress(100);
      
      toast({
        title: "Points Awarded!",
        description: `You earned ${item.pointsValue} points for viewing this content.`,
        variant: "default",
      });
    }
  };
  
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!item || pointsAwarded || !item.pointsEnabled || item.completionCriteria !== 'scroll_end') return;
    
    const target = e.currentTarget;
    const scrollPosition = target.scrollTop + target.clientHeight;
    const scrollHeight = target.scrollHeight;
    const scrollPercentage = (scrollPosition / scrollHeight) * 100;
    
    setProgress(Math.min(Math.floor(scrollPercentage), 100));
    
    if (scrollPercentage > 90 && !pointsAwarded) {
      awardPoints({
        type: 'content_completion',
        description: `Read through "${item.title}"`,
        points: item.pointsValue
      });
      setPointsAwarded(true);
      setProgress(100);
      
      toast({
        title: "Points Awarded!",
        description: `You earned ${item.pointsValue} points for reading through this content.`,
        variant: "default",
      });
    }
  };

  const handleAccessContent = () => {
    handleExternalContentAccess(item, handleContentView);
  };

  if (!item) return null;

  return (
    <Dialog open={!!item} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" onScroll={handleScroll}>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{item.title}</DialogTitle>
          <DialogDescription>
            <ContentHeader item={item} />
          </DialogDescription>
        </DialogHeader>

        <ContentPreview item={item} onContentView={handleContentView} />

        <ContentProgress 
          progress={progress} 
          showProgress={item.pointsEnabled}
        />

        <ContentDetails item={item} />

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleAccessContent}>
            {item.accessLevel === 'premium' ? (
              <>
                <Lock className="mr-2 h-4 w-4" /> Unlock Premium Content
              </>
            ) : (
              <>
                <ExternalLink className="mr-2 h-4 w-4" /> Access Content
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContentViewer;
