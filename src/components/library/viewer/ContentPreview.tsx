
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

export interface ContentPreviewProps {
  item: ContentItem;
  onContentView: () => void;
  isFullscreen?: boolean;
  hasAccess?: boolean;
  onProgress?: (progressPercentage: number) => void;
  handleAccess?: () => void;
}

const ContentPreview: React.FC<ContentPreviewProps> = ({ 
  item, 
  onContentView, 
  isFullscreen = false,
  hasAccess = true,
  onProgress,
  handleAccess
}) => {
  const handleContentAccess = () => {
    if (handleAccess) {
      handleAccess();
    } else {
      handleExternalContentAccess(item, onContentView);
    }
  };

  // Render different preview types based on content format
  const renderPreview = () => {
    switch (item.format) {
      case 'course':
        return (
          <CoursePreview 
            item={item} 
            onContentView={onContentView} 
            handleAccess={handleContentAccess} 
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
            handleAccess={handleContentAccess}
            isFullscreen={isFullscreen}
            getEmbedUrl={getEmbedUrl}
          />
        );
        
      case 'pdf':
        return (
          <PDFPreview
            item={item}
            onContentView={onContentView}
            handleAccess={handleContentAccess}
            isFullscreen={isFullscreen}
            getEmbedUrl={getEmbedUrl}
          />
        );
        
      case 'audio':
        return (
          <AudioPreview
            item={item}
            handleAccess={handleContentAccess}
          />
        );
        
      case 'image':
        return (
          <ImagePreview
            item={item}
            onContentView={onContentView}
            handleAccess={handleContentAccess}
            isFullscreen={isFullscreen}
          />
        );
        
      case 'text':
      case 'gdoc':
        return (
          <DocumentPreview
            item={item}
            onContentView={onContentView}
            handleAccess={handleContentAccess}
            isFullscreen={isFullscreen}
            getEmbedUrl={getEmbedUrl}
          />
        );
        
      default:
        return (
          <GenericPreview
            item={item}
            onContentView={onContentView}
            handleAccess={handleContentAccess}
            isFullscreen={isFullscreen}
          />
        );
    }
  };

  return renderPreview();
};

export default ContentPreview;
