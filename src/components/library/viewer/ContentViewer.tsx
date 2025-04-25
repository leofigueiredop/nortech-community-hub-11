
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ContentItem } from '@/types/library';
import { useContentProgress } from '@/hooks/useContentProgress';
import { usePoints } from '@/context/PointsContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import ContentHeader from '@/components/library/viewer/ContentHeader';
import ContentPreview from '@/components/library/viewer/ContentPreview';
import ContentDetails from '@/components/library/viewer/ContentDetails';
import ContentComments from '@/components/library/viewer/ContentComments';
import ContentProgress from '@/components/library/viewer/ContentProgress';
import { ArrowRight, Lock, Share2, Bookmark, Flag } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getContentDuration, getCompletionCriteria } from './contentViewerUtils';
import { toast } from '@/hooks/use-toast';

interface ContentViewerProps {
  item: ContentItem | null;
  onClose: () => void;
}

const ContentViewer: React.FC<ContentViewerProps> = ({ item, onClose }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('details');
  const [hasAccess, setHasAccess] = useState(false);
  const { addProgress, updateProgress, getProgress, awardPoints } = useContentProgress();
  const { awardPoints: addUserPoints } = usePoints();
  const [viewStartTime, setViewStartTime] = useState<number | null>(null);

  useEffect(() => {
    if (item) {
      setActiveTab('details');
      setHasAccess(item.accessLevel === 'free');
      addProgress(item.id);
    }
  }, [item, addProgress]);

  if (!item) return null;

  const progress = getProgress(item.id)?.progress || 0;
  const isCompleted = progress >= 100;

  const handleStartCourse = () => {
    navigate(`/course/${item.id}`);
    onClose();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied!",
      description: "The content link has been copied to your clipboard.",
    });
  };

  const handleSave = () => {
    toast({
      title: "Content saved",
      description: "The content has been added to your saved items.",
    });
  };

  const handleReport = () => {
    toast({
      title: "Report submitted",
      description: "Thank you for your feedback. We'll review this content.",
    });
  };

  // Special handler for Course format
  if (item.format === 'course') {
    return (
      <Dialog open={!!item} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden">
          <div className="relative aspect-video w-full overflow-hidden">
            <img 
              src={item.thumbnail} 
              alt={item.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="mb-2 flex items-center gap-2">
                <span className="bg-primary text-white text-xs px-2 py-1 rounded-md">Course</span>
                {item.accessLevel === 'premium' && (
                  <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                    <Lock className="h-3 w-3" /> Premium
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">{item.title}</h2>
              <p className="text-slate-200 text-sm line-clamp-2 mb-4">{item.description}</p>
              
              <div className="flex items-center gap-2">
                <Button 
                  onClick={handleStartCourse}
                  size="lg"
                  className="bg-primary text-white hover:bg-primary/90"
                >
                  Start Course <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <div className="flex gap-2 ml-auto">
                  <Button variant="outline" size="icon" onClick={handleShare} className="bg-black/40 border-white/30 text-white hover:bg-black/60">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleSave} className="bg-black/40 border-white/30 text-white hover:bg-black/60">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleReport} className="bg-black/40 border-white/30 text-white hover:bg-black/60">
                    <Flag className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              <h4 className="font-medium">What you'll learn:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Build modern React applications from scratch</li>
                <li>• Master React hooks and state management</li>
                <li>• Create reusable components and custom hooks</li>
                <li>• Implement responsive designs with Tailwind CSS</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // For non-course content, show the regular content viewer
  return (
    <Dialog open={!!item} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <ScrollArea className="h-[calc(100vh-10rem)]">
          <div className="p-6">
            <ContentHeader item={item} onBack={onClose} />
            
            <ContentPreview 
              item={item} 
              hasAccess={hasAccess}
              onContentView={() => setViewStartTime(Date.now())}
              handleAccess={() => setHasAccess(true)}
            />
            
            <ContentProgress 
              progress={progress}
              showProgress={true}
              pointsValue={item.pointsValue || 0}
              pointsEnabled={!!item.pointsEnabled}
              isCompleted={isCompleted}
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
            </Tabs>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ContentViewer;
