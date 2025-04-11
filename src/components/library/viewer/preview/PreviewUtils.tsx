
import { ContentItem } from '@/types/library';

export const getEmbedUrl = (item: ContentItem): string => {
  if (!item.resourceUrl) return '';
  
  switch (item.format) {
    case 'youtube':
      // Extract YouTube video ID from various URL formats
      const youtubeRegex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const youtubeMatch = item.resourceUrl.match(youtubeRegex);
      const youtubeId = youtubeMatch?.[2];
      return youtubeId ? `https://www.youtube.com/embed/${youtubeId}` : '';
      
    case 'vimeo':
      // Extract Vimeo video ID from various URL formats
      const vimeoRegex = /(?:vimeo.com\/|player\.vimeo\.com\/video\/)(\d+)/;
      const vimeoMatch = item.resourceUrl.match(vimeoRegex);
      const vimeoId = vimeoMatch?.[1];
      return vimeoId ? `https://player.vimeo.com/video/${vimeoId}` : '';
      
    case 'gdoc':
      // Google Doc viewer URL
      return `https://docs.google.com/viewer?embedded=true&url=${encodeURIComponent(item.resourceUrl)}`;
      
    case 'pdf':
      // PDF viewer URL
      return item.resourceUrl;
      
    default:
      return item.resourceUrl;
  }
};
