
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ContentItem } from '@/types/library';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ContentHeader from '@/components/library/viewer/ContentHeader';
import ContentPreview from '@/components/library/viewer/ContentPreview';
import ContentDetails from '@/components/library/viewer/ContentDetails';
import ContentComments from '@/components/library/viewer/ContentComments';
import ContentProgress from '@/components/library/viewer/ContentProgress';
import { getContentDuration, getCompletionCriteria } from './contentViewerUtils';

interface MainContentViewerProps {
  item: ContentItem;
  progress: number;
  isCompleted: boolean;
  hasAccess: boolean;
  onClose: () => void;
  onContentView: () => void;
  handleAccess: () => void;
}

const MainContentViewer: React.FC<MainContentViewerProps> = ({
  item,
  progress,
  isCompleted,
  hasAccess,
  onClose,
  onContentView,
  handleAccess
}) => {
  const [activeTab, setActiveTab] = useState('details');

  return (
    <Dialog open={!!item} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <ScrollArea className="h-[calc(100vh-10rem)]">
          <div className="p-6">
            <ContentHeader item={item} onBack={onClose} />
            
            <ContentPreview 
              item={item} 
              hasAccess={hasAccess}
              onContentView={onContentView}
              handleAccess={handleAccess}
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

export default MainContentViewer;
