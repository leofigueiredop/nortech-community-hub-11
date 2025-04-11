
import { ContentItem, ContentFormat } from '@/types/library';

export const getContentTypeIcon = (format: ContentFormat): string => {
  switch (format) {
    case 'video':
      return 'video';
    case 'youtube':
    case 'vimeo':
      return 'video';
    case 'audio':
      return 'headphones';
    case 'pdf':
      return 'file-text';
    case 'text':
      return 'file-text';
    case 'gdoc':
      return 'file-text';
    case 'image':
      return 'image';
    case 'course':
      return 'book';
    case 'url':
    case 'link':
      return 'link';
    default:
      return 'file';
  }
};

export const getContentTypeName = (format: ContentFormat): string => {
  switch (format) {
    case 'video':
      return 'Video';
    case 'youtube':
      return 'YouTube Video';
    case 'vimeo':
      return 'Vimeo Video';
    case 'audio':
      return 'Audio';
    case 'pdf':
      return 'PDF Document';
    case 'text':
      return 'Text';
    case 'gdoc':
      return 'Google Document';
    case 'image':
      return 'Image';
    case 'course':
      return 'Course';
    case 'url':
    case 'link':
      return 'External Link';
    default:
      return 'Document';
  }
};

export const formatDuration = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds} sec${seconds !== 1 ? 's' : ''}`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} min${minutes !== 1 ? 's' : ''}${remainingSeconds > 0 ? ` ${remainingSeconds} sec${remainingSeconds !== 1 ? 's' : ''}` : ''}`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours} hr${hours !== 1 ? 's' : ''}${minutes > 0 ? ` ${minutes} min${minutes !== 1 ? 's' : ''}` : ''}`;
  }
};

export const isContentPlayable = (item: ContentItem): boolean => {
  return ['video', 'youtube', 'vimeo', 'audio'].includes(item.format);
};

export const isContentReadable = (item: ContentItem): boolean => {
  return ['pdf', 'text', 'gdoc'].includes(item.format);
};

export const isContentInteractive = (item: ContentItem): boolean => {
  return item.format === 'course';
};

export const isContentViewable = (item: ContentItem): boolean => {
  return item.format === 'image';
};

export const isContentLinkable = (item: ContentItem): boolean => {
  return ['url', 'link'].includes(item.format);
};
