
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ExternalLink, Lock, Maximize, MessageSquare } from 'lucide-react';
import { ContentItem } from '@/types/library';
import { usePoints } from '@/context/PointsContext';
import ContentPreview from './ContentPreview';
import ContentDetails from './ContentDetails';
import ContentProgress from './ContentProgress';
import ContentHeader from './ContentHeader';
import ContentComments from './ContentComments';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { handleExternalContentAccess } from './contentViewerUtils';

interface ContentViewerProps {
  item: ContentItem | null;
  onClose: () => void;
}

const ContentViewer: React.FC<ContentViewerProps> = ({ item, onClose }) => {
  const { awardPoints } = usePoints();
  const [progress, setProgress] = useState(0);
  const [pointsAwarded, setPointsAwarded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const timeSpentRef = React.useRef(0);
  const intervalRef = React.useRef<number | null>(null);
  
  React.useEffect(() => {
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
    }
  };

  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleAccessContent = () => {
    handleExternalContentAccess(item, handleContentView);
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  if (!item) return null;

  return (
    <Dialog 
      open={!!item} 
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent 
        className={`${isFullscreen ? 'max-w-full max-h-full h-screen m-0 p-6 rounded-none' : 'max-w-3xl max-h-[90vh]'} overflow-y-auto`} 
        onScroll={handleScroll}
      >
        <div className="flex justify-between items-start">
          <DialogHeader className="flex-grow">
            <DialogTitle className="text-xl font-bold">{item.title}</DialogTitle>
            <DialogDescription>
              <ContentHeader item={item} />
            </DialogDescription>
          </DialogHeader>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleFullscreenToggle}
            className="ml-auto"
          >
            <Maximize className="h-5 w-5" />
          </Button>
        </div>

        <ContentPreview 
          item={item} 
          onContentView={handleContentView} 
          isFullscreen={isFullscreen}
        />

        <ContentProgress 
          progress={progress} 
          showProgress={item.pointsEnabled}
        />

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="comments" className="flex items-center gap-1" onClick={toggleComments}>
              <MessageSquare className="h-4 w-4" /> Comments
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
            <ScrollArea className={isFullscreen ? 'h-[calc(100vh-350px)]' : 'max-h-[300px]'}>
              <ContentDetails item={item} />
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="comments">
            <ScrollArea className={isFullscreen ? 'h-[calc(100vh-350px)]' : 'max-h-[300px]'}>
              {showComments && <ContentComments contentId={item.id} />}
            </ScrollArea>
          </TabsContent>
        </Tabs>

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
