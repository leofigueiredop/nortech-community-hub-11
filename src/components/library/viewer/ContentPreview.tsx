
import React from 'react';
import { Button } from '@/components/ui/button';
import { Lock, FileText, Download, ExternalLink } from 'lucide-react';
import { ContentItem } from '@/types/library';
import { handleExternalContentAccess } from './contentViewerUtils';

interface ContentPreviewProps {
  item: ContentItem;
  onContentView: () => void;
}

const ContentPreview: React.FC<ContentPreviewProps> = ({ item, onContentView }) => {
  const handleAccess = () => {
    handleExternalContentAccess(item, onContentView);
  };

  switch (item.format) {
    case 'video':
      return (
        <div className="aspect-video bg-slate-900 rounded-lg flex items-center justify-center mb-6">
          <div className="text-center">
            <FileText size={48} className="mx-auto mb-2 text-muted-foreground" />
            <p className="text-muted-foreground">Video preview not available</p>
            <Button 
              onClick={handleAccess} 
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
              onClick={handleAccess} 
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
              onClick={handleAccess} 
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

export default ContentPreview;
