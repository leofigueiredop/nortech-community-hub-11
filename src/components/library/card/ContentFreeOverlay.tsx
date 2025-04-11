
import React from 'react';
import { ContentItem } from '@/types/library';
import { Play, Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ContentFreeOverlayProps {
  item: ContentItem;
}

const ContentFreeOverlay: React.FC<ContentFreeOverlayProps> = ({ item }) => {
  const getContentIcon = (format: string) => {
    switch (format) {
      case 'video':
      case 'youtube':
      case 'vimeo':
        return <Play className="h-10 w-10 text-white" />;
      case 'pdf':
      case 'text':
      case 'gdoc':
        return <FileText className="h-10 w-10 text-white" />;
      default:
        return <Download className="h-10 w-10 text-white" />;
    }
  };

  const getActionText = (format: string) => {
    switch (format) {
      case 'video':
      case 'youtube':
      case 'vimeo':
        return 'Watch Now';
      case 'pdf':
      case 'text':
      case 'gdoc':
        return 'Read Now';
      case 'audio':
        return 'Listen Now';
      default:
        return 'View Now';
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 transition-opacity duration-300">
      <div className="w-16 h-16 bg-nortech-purple rounded-full flex items-center justify-center mb-4">
        {getContentIcon(item.format)}
      </div>
      <Button 
        className="bg-nortech-purple hover:bg-nortech-purple/90 text-white font-medium px-6"
      >
        {getActionText(item.format)}
      </Button>
    </div>
  );
};

export default ContentFreeOverlay;
