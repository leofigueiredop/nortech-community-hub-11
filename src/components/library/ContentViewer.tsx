
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
import ContentProgress from '@/components/library/viewer/ContentProgress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  getContentDuration, 
  getCompletionCriteria 
} from './viewer/contentViewerUtils';
import { usePointsTracking } from '@/utils/pointsTracking';

interface ContentViewerProps {
  item: ContentItem | null;
  onClose: () => void;
}

const ContentViewer: React.FC<ContentViewerProps> = ({ item, onClose }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [hasAccess, setHasAccess] = useState(false);
  const [earnedBadges, setEarnedBadges] = useState<{name: string, description: string}[]>([]);
  const { addProgress, updateProgress, getProgress, awardPoints, getAllProgress } = useContentProgress();
  const { awardPoints: addUserPoints } = usePoints();
  const { trackContentCompletion, awardCustomBadge } = usePointsTracking();
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
      
      // Check for format-specific badges
      checkForBadges(item);
    }
  }, [item, addProgress]);

  // Check for format-specific badges
  const checkForBadges = (currentItem: ContentItem) => {
    const allProgress = getAllProgress();
    const badges: {name: string, description: string}[] = [];
    
    // Format-specific badge checks
    if (currentItem.format === 'pdf') {
      // Check if completed 3 PDFs
      const completedPDFs = allProgress.filter(p => 
        p.completed && 
        p.contentId.includes('pdf') // This is simplified - you'd need proper content type tracking
      );
      
      if (completedPDFs.length >= 3) {
        const badge = {
          name: "PDF Master",
          description: "Completed 3 PDF documents"
        };
        badges.push(badge);
        awardCustomBadge(badge.name, badge.description, 'achievement');
      }
    }
    
    if (currentItem.format === 'course' && getProgress(currentItem.id)?.completed) {
      const badge = {
        name: `${currentItem.title} Graduate`,
        description: `Completed the ${currentItem.title} course`
      };
      badges.push(badge);
    }
    
    // If any item is 100% complete
    if (getProgress(currentItem.id)?.completed) {
      badges.push({
        name: "Completionist",
        description: "Finished a piece of content"
      });
    }
    
    setEarnedBadges(badges);
  };

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
    
    // Apply format-specific completion thresholds
    let shouldComplete = false;
    if (item.format === 'pdf' && progressPercentage >= 90) shouldComplete = true;
    else if (item.format === 'audio' && progressPercentage >= 70) shouldComplete = true;
    else if (progressPercentage >= 100) shouldComplete = true;
    
    const finalProgress = shouldComplete ? 100 : progressPercentage;
    updateProgress(item.id, finalProgress);
    
    // Award points if applicable and completed
    if (shouldComplete && item.pointsEnabled) {
      const progress = getProgress(item.id);
      if (progress && !progress.pointsAwarded) {
        awardPoints(item.id);
        if (item.pointsValue) {
          addUserPoints({
            type: 'content_completion',
            description: `Completed "${item.title}"`,
            points: item.pointsValue
          });
          
          // Track content completion for badges
          trackContentCompletion(item);
          checkForBadges(item);
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
        // Increase progress based on time spent and format
        let progressIncrement = Math.floor(timeSpent / 10);
        
        // Format-specific progress calculations
        if (item.format === 'video' && item.duration > 0) {
          progressIncrement = Math.floor((timeSpent / item.duration) * 100);
        } else if (item.format === 'audio' && item.duration > 0) {
          progressIncrement = Math.floor((timeSpent / item.duration) * 100);
        }
        
        const newProgress = Math.min(
          100, 
          currentProgress.progress + progressIncrement
        );
        
        updateProgress(item.id, newProgress);
        handleProgress(newProgress); // Check if we reached completion threshold
      }
    }
    
    // Reset state
    setViewStartTime(null);
    
    // Call parent close handler
    onClose();
  };

  if (!item) return null;

  const progress = getProgress(item.id)?.progress || 0;
  const isCompleted = progress >= 100;

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
            
            <ContentProgress 
              progress={progress}
              showProgress={true}
              pointsValue={item.pointsValue || 0}
              pointsEnabled={!!item.pointsEnabled}
              isCompleted={isCompleted}
              format={item.format}
              badges={earnedBadges}
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
                <ContentDetails 
                  item={item} 
                  duration={getContentDuration(item.duration || 0)} 
                  completionCriteria={getCompletionCriteria(item)} 
                />
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
                  <div className="py-4 space-y-4">
                    <h3 className="text-lg font-medium">Course Modules</h3>
                    <div className="space-y-2">
                      {[1, 2, 3].map((module) => (
                        <div key={module} className="border rounded-md p-3">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium">Module {module}: Introduction</h4>
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                              {module === 1 ? 'Completed' : module === 2 ? 'In Progress' : 'Locked'}
                            </span>
                          </div>
                          <Progress value={module === 1 ? 100 : module === 2 ? 40 : 0} className="h-1.5 mb-2" />
                          <div className="text-xs text-muted-foreground">
                            {module === 1 ? 'Completed on Apr 10, 2023' : module === 2 ? '40% complete' : 'Unlock by completing previous modules'}
                          </div>
                        </div>
                      ))}
                    </div>
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
