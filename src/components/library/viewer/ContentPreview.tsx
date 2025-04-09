import React from 'react';
import { Button } from '@/components/ui/button';
import { Lock, FileText, Download, ExternalLink, Video, FileVideo, File, BookOpen, Image } from 'lucide-react';
import { ContentItem } from '@/types/library';
import { handleExternalContentAccess } from './contentViewerUtils';

interface ContentPreviewProps {
  item: ContentItem;
  onContentView: () => void;
  isFullscreen?: boolean;
}

const ContentPreview: React.FC<ContentPreviewProps> = ({ item, onContentView, isFullscreen = false }) => {
  const handleAccess = () => {
    handleExternalContentAccess(item, onContentView);
  };

  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch') || url.includes('youtu.be')) {
      const videoId = url.includes('youtu.be/') 
        ? url.split('youtu.be/')[1].split('?')[0]
        : url.split('v=')[1].split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    if (url.includes('vimeo.com')) {
      const vimeoId = url.split('vimeo.com/')[1].split('?')[0];
      return `https://player.vimeo.com/video/${vimeoId}`;
    }
    
    if (url.includes('drive.google.com/file/d')) {
      const fileId = url.match(/\/d\/(.*?)\//) ? url.match(/\/d\/(.*?)\//)![1] : '';
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }
    
    if (url.includes('docs.google.com/document')) {
      return url.replace('/edit', '/preview');
    }
    
    return url;
  };

  const previewClass = isFullscreen 
    ? "aspect-video w-full max-h-[70vh] bg-slate-900 rounded-lg flex items-center justify-center mb-6"
    : "aspect-video bg-slate-900 rounded-lg flex items-center justify-center mb-6";

  switch (item.format) {
    case 'video':
    case 'youtube':
    case 'vimeo':
      if (item.resourceUrl.includes('youtube.com') || 
          item.resourceUrl.includes('youtu.be') || 
          item.resourceUrl.includes('vimeo.com')) {
        return (
          <div className={previewClass}>
            <iframe 
              src={getEmbedUrl(item.resourceUrl)}
              className="w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={item.title}
            />
          </div>
        );
      }
      return (
        <div className={previewClass}>
          <div className="text-center">
            <FileVideo size={48} className="mx-auto mb-2 text-muted-foreground" />
            <p className="text-muted-foreground">Video preview not available</p>
            <Button 
              onClick={handleAccess} 
              className="mt-4"
            >
              {item.accessLevel === 'premium' ? (
                <>
                  <Lock className="mr-2 h-4 w-4" /> Unlock Premium Video
                </>
              ) : (
                <>
                  <Video className="mr-2 h-4 w-4" /> Watch Video
                </>
              )}
            </Button>
          </div>
        </div>
      );
    case 'pdf':
      if (item.accessLevel === 'free' && 
          (item.resourceUrl.endsWith('.pdf') || item.resourceUrl.includes('drive.google.com'))) {
        return (
          <div className={`${isFullscreen ? 'h-[70vh]' : 'aspect-[3/4]'} bg-slate-100 dark:bg-slate-800 rounded-lg mb-6`}>
            <iframe 
              src={getEmbedUrl(item.resourceUrl)}
              className="w-full h-full rounded-lg"
              title={item.title}
            />
          </div>
        );
      }
      return (
        <div className={`${isFullscreen ? 'h-[70vh]' : 'aspect-[3/4]'} bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center mb-6`}>
          <div className="text-center">
            <File size={48} className="mx-auto mb-2 text-muted-foreground" />
            <p className="text-muted-foreground">PDF preview not available</p>
            <Button 
              onClick={handleAccess} 
              className="mt-4"
            >
              {item.accessLevel === 'premium' ? (
                <>
                  <Lock className="mr-2 h-4 w-4" /> Unlock Premium Document
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" /> View Document
                </>
              )}
            </Button>
          </div>
        </div>
      );
    case 'image':
      return (
        <div className={`${isFullscreen ? 'max-h-[70vh] flex justify-center' : ''} mb-6`}>
          <img 
            src={item.resourceUrl || item.thumbnailUrl || '/placeholder.svg'} 
            alt={item.title} 
            className={`${isFullscreen ? 'max-h-[70vh] object-contain' : 'w-full'} rounded-lg`}
            onLoad={onContentView}
          />
        </div>
      );
    case 'gdoc':
    case 'gdrive':
      return (
        <div className={previewClass}>
          <iframe 
            src={getEmbedUrl(item.resourceUrl)}
            className="w-full h-full rounded-lg"
            title={item.title}
          />
        </div>
      );
    case 'course':
      return (
        <div className={`${isFullscreen ? 'h-[70vh]' : 'aspect-video'} bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center mb-6`}>
          <div className="text-center">
            <BookOpen size={48} className="mx-auto mb-2 text-muted-foreground" />
            <p className="text-muted-foreground">Course overview</p>
            <Button 
              onClick={handleAccess} 
              className="mt-4"
            >
              {item.accessLevel === 'premium' ? (
                <>
                  <Lock className="mr-2 h-4 w-4" /> Unlock Premium Course
                </>
              ) : (
                <>
                  <ExternalLink className="mr-2 h-4 w-4" /> Access Course
                </>
              )}
            </Button>
          </div>
        </div>
      );
    default:
      return (
        <div className={`${isFullscreen ? 'h-[70vh]' : 'aspect-video'} bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center mb-6`}>
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
