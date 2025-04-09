
export type ContentFormat = 'video' | 'pdf' | 'link' | 'audio' | 'image' | 'text';
export type AccessLevel = 'free' | 'premium';

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  format: ContentFormat;
  thumbnailUrl?: string;
  resourceUrl: string;
  tags: string[];
  accessLevel: AccessLevel;
  createdAt: string;
  updatedAt: string;
  duration?: string; // For video/audio content
  fileSize?: string; // For downloadable content
  views: number;
  featured?: boolean;
}

export interface ContentCategory {
  id: string;
  name: string;
  description?: string;
  count: number;
}
