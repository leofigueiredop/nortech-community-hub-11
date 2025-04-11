
import React from 'react';
import { ContentItem } from '@/types/library';
import { handleExternalContentAccess } from './contentViewerUtils';
import { getEmbedUrl } from './preview/PreviewUtils';

// Import specialized preview components
import CoursePreview from './preview/CoursePreview';
import VideoPreview from './preview/VideoPreview';
import PDFPreview from './preview/PDFPreview';
import AudioPreview from './preview/AudioPreview';
import ImagePreview from './preview/ImagePreview';
import DocumentPreview from './preview/DocumentPreview';
import GenericPreview from './preview/GenericPreview';

interface ContentPreviewProps {
  item: ContentItem;
  onContentView: () => void;
  isFullscreen?: boolean;
}

const ContentPreview: React.FC<ContentPreviewProps> = ({ 
  item, 
  onContentView, 
  isFullscreen = false 
}) => {
  const handleAccess = () => {
    handleExternalContentAccess(item, onContentView);
  };

  // Render different preview types based on content format
  const renderPreview = () => {
    switch (item.format) {
      case 'course':
        return (
          <CoursePreview 
            item={item} 
            onContentView={onContentView} 
            handleAccess={handleAccess} 
            isFullscreen={isFullscreen} 
          />
        );
        
      case 'video':
      case 'youtube':
      case 'vimeo':
        return (
          <VideoPreview
            item={item}
            onContentView={onContentView}
            handleAccess={handleAccess}
            isFullscreen={isFullscreen}
            getEmbedUrl={getEmbedUrl}
          />
        );
        
      case 'pdf':
        return (
          <PDFPreview
            item={item}
            onContentView={onContentView}
            handleAccess={handleAccess}
            isFullscreen={isFullscreen}
            getEmbedUrl={getEmbedUrl}
          />
        );
        
      case 'audio':
        return (
          <AudioPreview
            item={item}
            onContentView={onContentView}
            handleAccess={handleAccess}
          />
        );
        
      case 'image':
        return (
          <ImagePreview
            item={item}
            onContentView={onContentView}
            handleAccess={handleAccess}
            isFullscreen={isFullscreen}
          />
        );
        
      case 'gdoc':
      case 'gdrive':
        return (
          <DocumentPreview
            item={item}
            onContentView={onContentView}
            handleAccess={handleAccess}
            isFullscreen={isFullscreen}
            getEmbedUrl={getEmbedUrl}
          />
        );
        
      default:
        return (
          <GenericPreview
            item={item}
            onContentView={onContentView}
            handleAccess={handleAccess}
            isFullscreen={isFullscreen}
          />
        );
    }
  };

  return renderPreview();
};

export default ContentPreview;
