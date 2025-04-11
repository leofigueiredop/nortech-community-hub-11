
import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogOverlay
} from '@/components/ui/dialog';
import { ContentItem } from '@/types/library';
import ContentHeader from './ContentHeader';
import ContentPreview from './ContentPreview';
import ContentDetails from './ContentDetails';
import ContentComments from './ContentComments';
import ContentProgress from './ContentProgress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getCompletionCriteria, getContentDuration } from './contentViewerUtils';

interface ContentViewerProps {
  item: ContentItem | null;
  onClose: () => void;
}

const ContentViewer: React.FC<ContentViewerProps> = ({ item, onClose }) => {
  if (!item) return null;
  
  // Determine if content is free or premium
  const isPremium = item.accessLevel === 'premium';
  
  // Determine content type for appropriate preview component
  const contentType = item.format;
  
  // Get content duration in a readable format
  const duration = getContentDuration(item.duration);
  
  // Get completion criteria text
  const completionCriteria = getCompletionCriteria(item);
  
  return (
    <Dialog open={!!item} onOpenChange={() => onClose()}>
      <DialogOverlay className="bg-black/80 backdrop-blur-sm" />
      <DialogContent className="max-w-6xl max-h-[90vh] p-0 border-none overflow-hidden bg-background">
        <div className="flex flex-col h-full max-h-[90vh]">
          <div className="p-4 sm:p-6">
            <ContentHeader item={item} onBack={onClose} />
          </div>
          
          <div className="flex-1 flex flex-col md:flex-row min-h-0">
            {/* Content preview area (left/top) */}
            <div className="w-full md:w-2/3 p-4">
              <ContentPreview 
                item={item} 
                isPremium={isPremium} 
              />
            </div>
            
            {/* Content details and comments (right/bottom) */}
            <div className="w-full md:w-1/3 border-t md:border-t-0 md:border-l border-border/50">
              <ScrollArea className="h-[calc(100vh-15rem)] md:h-[60vh]">
                <div className="p-4">
                  <ContentDetails 
                    item={item}
                    duration={duration}
                    completionCriteria={completionCriteria}
                  />
                  
                  <ContentProgress 
                    item={item}
                    isPremium={isPremium}
                  />
                  
                  <ContentComments itemId={item.id} />
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContentViewer;
