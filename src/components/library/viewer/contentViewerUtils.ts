
import { ContentItem } from '@/types/library';
import { toast } from '@/hooks/use-toast';

export const handleExternalContentAccess = (item: ContentItem | null, onContentView: () => void) => {
  if (!item) return;

  if (item.accessLevel === 'premium') {
    toast({
      title: 'Premium Content',
      description: 'This content requires a premium subscription.',
      variant: 'destructive',
    });
    return;
  }
  
  // Track content view
  onContentView();
  
  // Handle different content types
  switch (item.format) {
    case 'pdf':
    case 'audio':
    case 'image':
      toast({
        title: 'Downloading Content',
        description: `Downloading ${item.title}`,
      });
      window.open(item.resourceUrl, '_blank');
      break;
    
    case 'course':
      toast({
        title: 'Opening Course',
        description: `Opening ${item.title}`,
      });
      // In a real app, navigate to course page
      window.open(`/courses/${item.id}`, '_blank');
      break;
      
    case 'youtube':
    case 'vimeo':
    case 'gdoc':
    case 'gdrive':
    case 'link':
    default:
      toast({
        title: 'Opening Content',
        description: `Opening ${item.title}`,
      });
      window.open(item.resourceUrl, '_blank');
      break;
  }
};

// Helper to determine content type from URL
export const getContentTypeFromUrl = (url: string): string => {
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube';
  if (url.includes('vimeo.com')) return 'Vimeo';
  if (url.includes('drive.google.com/file')) return 'Google Drive';
  if (url.includes('docs.google.com')) return 'Google Doc';
  if (url.endsWith('.pdf')) return 'PDF';
  if (url.endsWith('.mp3') || url.endsWith('.wav')) return 'Audio';
  if (url.endsWith('.mp4') || url.endsWith('.mov')) return 'Video';
  if (url.endsWith('.jpg') || url.endsWith('.png') || url.endsWith('.gif')) return 'Image';
  
  return 'External Link';
};
