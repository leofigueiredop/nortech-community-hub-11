
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
import { 
  ExternalLink, 
  Lock, 
  Share2, 
  Bookmark, 
  Flag,
  Download,
  PlayCircle
} from 'lucide-react';
import { ContentItem } from '@/types/library';
import { toast } from '@/hooks/use-toast';
import { usePoints } from '@/context/PointsContext';
import ContentPreview from './ContentPreview';
import ContentDetails from './ContentDetails';
import ContentProgress from './ContentProgress';
import ContentHeader from './ContentHeader';
import { handleExternalContentAccess } from './contentViewerUtils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ContentFormatIcon } from '../management/utils/ContentFormatIcon';

interface ContentViewerProps {
  item: ContentItem | null;
  onClose: () => void;
}

const ContentViewer: React.FC<ContentViewerProps> = ({ item, onClose }) => {
  const { awardPoints } = usePoints();
  const [progress, setProgress] = useState(0);
  const [pointsAwarded, setPointsAwarded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
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
              points: item.pointsValue || 0
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
        points: item.pointsValue || 0
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
        points: item.pointsValue || 0
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

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!item) return null;

  // Determine the appropriate CTA text based on format and access level
  const getCtaText = () => {
    if (item.accessLevel === 'premium') {
      return 'Unlock Premium Content';
    }
    
    switch (item.format) {
      case 'video':
      case 'youtube':
      case 'vimeo':
        return 'Watch Full Video';
      case 'pdf':
        return 'Download PDF';
      case 'audio':
        return 'Listen Now';
      case 'course':
        return 'Start Course';
      default:
        return 'View Content';
    }
  };

  // Determine the CTA icon based on format
  const getCtaIcon = () => {
    if (item.accessLevel === 'premium') {
      return <Lock className="mr-2 h-4 w-4" />;
    }
    
    switch (item.format) {
      case 'video':
      case 'youtube':
      case 'vimeo':
        return <PlayCircle className="mr-2 h-4 w-4" />;
      case 'pdf':
        return <Download className="mr-2 h-4 w-4" />;
      default:
        return <ExternalLink className="mr-2 h-4 w-4" />;
    }
  };

  return (
    <Dialog open={!!item} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className={`${isFullscreen ? 'max-w-[90vw] h-[90vh]' : 'max-w-3xl max-h-[90vh]'} overflow-y-auto`} 
        onScroll={handleScroll}
      >
        <DialogHeader className="flex flex-row items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ContentFormatIcon format={item.format} size={20} className="text-primary" />
              <DialogTitle className="text-xl font-bold">{item.title}</DialogTitle>
            </div>
            <DialogDescription>
              <ContentHeader item={item} />
            </DialogDescription>
          </div>
          <div className="flex gap-1 mt-1">
            <Button variant="ghost" size="icon" onClick={() => {
              toast({
                title: "Content saved",
                description: "Added to your library",
              });
            }} title="Save">
              <Bookmark className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => {
              toast({
                title: "Share link copied",
                description: "Link copied to clipboard",
              });
            }} title="Share">
              <Share2 className="h-4 w-4" />
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" title="Report">
                  <Flag className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <h3 className="text-lg font-semibold mb-4">Report Content</h3>
                <p className="text-muted-foreground mb-4">
                  Please let us know why you're reporting this content.
                </p>
                <div className="space-y-2">
                  {['Inappropriate content', 'Copyright violation', 'Misleading information', 'Other'].map(reason => (
                    <Button 
                      key={reason} 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => {
                        toast({
                          title: "Content Reported",
                          description: "Thank you for helping keep our platform safe.",
                        });
                      }}
                    >
                      {reason}
                    </Button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </DialogHeader>

        <ContentPreview 
          item={item} 
          onContentView={handleContentView} 
          isFullscreen={isFullscreen}
        />

        <ContentProgress 
          progress={progress} 
          showProgress={item.pointsEnabled || item.format === 'video' || item.format === 'course'}
          pointsValue={item.pointsValue}
          pointsEnabled={item.pointsEnabled}
          isCompleted={progress >= 100}
        />

        <ContentDetails item={item} />

        <DialogFooter className="mt-6 flex justify-between items-center">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={toggleFullscreen}>
              {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </Button>
            
            <Button 
              onClick={handleAccessContent}
              className="bg-primary hover:bg-primary/90"
            >
              {getCtaIcon()}
              {getCtaText()}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContentViewer;
