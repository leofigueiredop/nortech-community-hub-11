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
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, Download, ExternalLink, Eye, FileText, Lock, Trophy } from 'lucide-react';
import { ContentItem } from '@/types/library';
import { formatDistanceToNow } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { usePoints } from '@/context/PointsContext';
import { Progress } from '@/components/ui/progress';

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
    if (item?.accessLevel === 'premium') {
      toast({
        title: 'Premium Content',
        description: 'This content requires a premium subscription.',
        variant: 'destructive',
      });
    } else {
      handleContentView();
      
      toast({
        title: 'Opening Content',
        description: `Opening ${item?.title}`,
      });
      window.open(item?.resourceUrl, '_blank');
    }
  };

  if (!item) return null;

  const renderContentPreview = () => {
    switch (item.format) {
      case 'video':
        return (
          <div className="aspect-video bg-slate-900 rounded-lg flex items-center justify-center mb-6">
            <div className="text-center">
              <FileText size={48} className="mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">Video preview not available</p>
              <Button 
                onClick={handleAccessContent} 
                className="mt-4"
              >
                {item.accessLevel === 'premium' ? (
                  <>
                    <Lock className="mr-2 h-4 w-4" /> Unlock Premium Content
                  </>
                ) : (
                  <>
                    <ExternalLink className="mr-2 h-4 w-4" /> Watch Video
                  </>
                )}
              </Button>
            </div>
          </div>
        );
      case 'pdf':
        return (
          <div className="aspect-[3/4] bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center mb-6">
            <div className="text-center">
              <FileText size={48} className="mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">PDF preview not available</p>
              <Button 
                onClick={handleAccessContent} 
                className="mt-4"
              >
                {item.accessLevel === 'premium' ? (
                  <>
                    <Lock className="mr-2 h-4 w-4" /> Unlock Premium Content
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" /> Download PDF
                  </>
                )}
              </Button>
            </div>
          </div>
        );
      case 'image':
        return (
          <div className="mb-6">
            <img 
              src={item.thumbnailUrl || '/placeholder.svg'} 
              alt={item.title} 
              className="w-full rounded-lg"
            />
          </div>
        );
      default:
        return (
          <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center mb-6">
            <div className="text-center">
              <FileText size={48} className="mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">Preview not available</p>
              <Button 
                onClick={handleAccessContent} 
                className="mt-4"
              >
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
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={!!item} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" onScroll={handleScroll}>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{item.title}</DialogTitle>
          <DialogDescription className="flex items-center gap-2 mt-2">
            <Badge 
              variant={item.accessLevel === 'premium' ? 'default' : 'outline'}
              className={item.accessLevel === 'premium' ? 'bg-amber-500 hover:bg-amber-600 border-none' : ''}
            >
              {item.accessLevel === 'premium' ? (
                <>
                  <Lock size={12} className="mr-1" /> Premium
                </>
              ) : (
                'Free'
              )}
            </Badge>
            {item.pointsEnabled && (
              <Badge variant="outline" className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-300">
                <Trophy size={12} className="mr-1" /> {item.pointsValue} pts
              </Badge>
            )}
            <span className="text-muted-foreground text-sm">
              <Calendar className="inline h-3 w-3 mr-1" />
              {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
            </span>
            <span className="text-muted-foreground text-sm">
              <Eye className="inline h-3 w-3 mr-1" />
              {item.views.toLocaleString()} views
            </span>
            {item.duration && (
              <span className="text-muted-foreground text-sm">
                <Clock className="inline h-3 w-3 mr-1" />
                {item.duration}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        {renderContentPreview()}

        {item.pointsEnabled && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-muted-foreground text-sm">{item.description}</p>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-2">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {item.tags.map(tag => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {item.fileSize && (
            <>
              <Separator />
              <div>
                <h3 className="font-medium mb-2">Details</h3>
                <p className="text-sm text-muted-foreground">File size: {item.fileSize}</p>
              </div>
            </>
          )}
        </div>

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
