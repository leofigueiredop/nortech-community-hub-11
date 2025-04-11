
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ContentItem } from '@/types/library';
import { useContentProgress } from '@/hooks/useContentProgress';
import { usePoints } from '@/context/PointsContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import ContentHeader from '@/components/library/viewer/ContentHeader';
import ContentPreview from '@/components/library/viewer/ContentPreview';
import ContentDetails from '@/components/library/viewer/ContentDetails';
import ContentComments from '@/components/library/viewer/ContentComments';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ContentViewerProps {
  item: ContentItem | null;
  onClose: () => void;
}

const ContentViewer: React.FC<ContentViewerProps> = ({ item, onClose }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [hasAccess, setHasAccess] = useState(false);
  const { addProgress, updateProgress, getProgress, awardPoints } = useContentProgress();
  const { awardPoints: addUserPoints } = usePoints();
  const [viewStartTime, setViewStartTime] = useState<number | null>(null);

  useEffect(() => {
    if (item) {
      // Reset state when item changes
      setActiveTab('details');
      
      // Check if user has free access to this content
      const hasFreeAccess = 
        item.accessLevel === 'free' || 
        (item.accessLevel === 'premium' && item.freeAccessesLeft && item.freeAccessesLeft > 0);
      
      setHasAccess(hasFreeAccess);
      
      // Add to progress tracking if not already there
      addProgress(item.id);
    }
  }, [item, addProgress]);

  // Dialog open state
  const isOpen = !!item;

  // Handle content view
  const handleContentView = () => {
    if (!item) return;
    
    // Set view start time
    setViewStartTime(Date.now());
    
    // Add initial progress if needed
    const progress = getProgress(item.id);
    if (!progress || progress.progress === 0) {
      updateProgress(item.id, 10); // Start with 10% progress
    }
  };

  // Handle content progress (called from content preview components)
  const handleProgress = (progressPercentage: number) => {
    if (!item) return;
    
    updateProgress(item.id, progressPercentage);
    
    // Award points if applicable and completed
    if (progressPercentage >= 100 && item.pointsEnabled) {
      const progress = getProgress(item.id);
      if (progress && !progress.pointsAwarded) {
        awardPoints(item.id);
        if (item.pointsValue) {
          addUserPoints(item.pointsValue);
        }
      }
    }
  };

  // Calculate time spent viewing content
  const calculateTimeSpent = () => {
    if (!viewStartTime) return 0;
    return Math.floor((Date.now() - viewStartTime) / 1000); // in seconds
  };

  // Handle content access (e.g., unlocking premium content)
  const handleAccess = () => {
    setHasAccess(true);
  };

  // Handle dialog close
  const handleClose = () => {
    if (!item) return;
    
    // Save progress before closing
    const timeSpent = calculateTimeSpent();
    if (timeSpent > 10) { // Only count if more than 10 seconds spent
      const currentProgress = getProgress(item.id);
      if (currentProgress) {
        // Increase progress based on time spent (simplified logic)
        const newProgress = Math.min(
          100, 
          currentProgress.progress + Math.floor(timeSpent / (item.duration / 100))
        );
        updateProgress(item.id, newProgress);
      }
    }
    
    // Reset state
    setViewStartTime(null);
    
    // Call parent close handler
    onClose();
  };

  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden" onPointerDownOutside={(e) => e.preventDefault()}>
        <ScrollArea className="h-[calc(100vh-10rem)]">
          <div className="p-6">
            <ContentHeader item={item} onBack={handleClose} />
            
            <ContentPreview 
              item={item} 
              hasAccess={hasAccess}
              onContentView={handleContentView}
              onProgress={handleProgress}
              handleAccess={handleAccess}
            />
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
              <TabsList className="w-full">
                <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
                {item.format === 'video' && (
                  <TabsTrigger value="transcript" className="flex-1">Transcript</TabsTrigger>
                )}
                {item.allowComments !== false && (
                  <TabsTrigger value="comments" className="flex-1">Comments</TabsTrigger>
                )}
                {item.format === 'course' && (
                  <TabsTrigger value="modules" className="flex-1">Modules</TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="details">
                <ContentDetails item={item} />
              </TabsContent>
              
              {item.format === 'video' && (
                <TabsContent value="transcript">
                  <div className="text-sm text-muted-foreground">
                    <p className="mb-4">Transcript not available for this content.</p>
                  </div>
                </TabsContent>
              )}
              
              {item.allowComments !== false && (
                <TabsContent value="comments">
                  <ContentComments itemId={item.id} />
                </TabsContent>
              )}
              
              {item.format === 'course' && (
                <TabsContent value="modules">
                  <div className="text-sm text-muted-foreground">
                    <p className="mb-4">This course has no modules yet.</p>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ContentViewer;
