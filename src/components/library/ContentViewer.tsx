
import React from 'react';
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
import { Calendar, Clock, Download, ExternalLink, Eye, FileText, Lock } from 'lucide-react';
import { ContentItem } from '@/types/library';
import { formatDistanceToNow } from 'date-fns';
import { toast } from '@/hooks/use-toast';

interface ContentViewerProps {
  item: ContentItem | null;
  onClose: () => void;
}

const ContentViewer: React.FC<ContentViewerProps> = ({ item, onClose }) => {
  if (!item) return null;

  const handleAccessContent = () => {
    if (item.accessLevel === 'premium') {
      toast({
        title: 'Premium Content',
        description: 'This content requires a premium subscription.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Opening Content',
        description: `Opening ${item.title}`,
      });
      // Logic to open the content would go here
      window.open(item.resourceUrl, '_blank');
    }
  };

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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
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
