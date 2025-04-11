
import { ContentItem } from '@/types/library';
import { toast } from '@/hooks/use-toast';

// Handle external content access
export const handleExternalContentAccess = (
  item: ContentItem | null, 
  onContentView: () => void
) => {
  if (!item) return;
  
  // Log access attempt
  console.log(`Accessing external content: ${item.title}`);
  
  // Call the content view handler
  onContentView();
  
  // Based on format, perform different actions
  switch (item.format) {
    case 'pdf':
    case 'image':
      if (item.resourceUrl) {
        window.open(item.resourceUrl, '_blank');
      } else {
        toast({
          title: "Resource not available",
          description: "The resource URL is not available for this content.",
          variant: "destructive",
        });
      }
      break;
      
    case 'link':
    case 'url':
      if (item.resourceUrl) {
        window.open(item.resourceUrl, '_blank');
      } else {
        toast({
          title: "Link not available",
          description: "The link is not available for this content.",
          variant: "destructive",
        });
      }
      break;
      
    default:
      // For other formats, just track the view
      toast({
        title: "Content accessed",
        description: "You are now viewing this content.",
      });
      break;
  }
};

// Format duration from seconds to readable format
export const formatDuration = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds} sec`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }
};

// Get content type name
export const getContentTypeName = (format: string): string => {
  const formatMap: Record<string, string> = {
    'video': 'Video',
    'audio': 'Audio',
    'pdf': 'PDF',
    'text': 'Article',
    'url': 'Web Link',
    'youtube': 'YouTube',
    'vimeo': 'Vimeo',
    'gdoc': 'Google Doc',
    'image': 'Image',
    'course': 'Course',
    'link': 'Link'
  };
  
  return formatMap[format] || 'Unknown';
};

// Add the missing functions
export const getContentDuration = (seconds: number): string => {
  return formatDuration(seconds);
};

export const getCompletionCriteria = (item: ContentItem): string => {
  if (item.completionCriteria) {
    return item.completionCriteria;
  }
  
  // Generate default completion criteria based on content format
  switch (item.format) {
    case 'video':
    case 'youtube':
    case 'vimeo':
      return 'Watch 90% of the video';
    case 'audio':
      return 'Listen to the full audio';
    case 'pdf':
    case 'text':
    case 'gdoc':
      return 'Read the document';
    case 'course':
      return 'Complete all modules';
    default:
      return 'View the full content';
  }
};
