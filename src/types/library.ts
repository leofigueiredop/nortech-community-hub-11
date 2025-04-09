
export type ContentFormat = 'video' | 'pdf' | 'link' | 'audio' | 'image' | 'text' | 'youtube' | 'vimeo' | 'gdoc' | 'gdrive';
export type AccessLevel = 'free' | 'premium';
export type ContentVisibility = 'public' | 'vip-only' | 'limited-time';

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
  categoryId?: string;
  visibility?: ContentVisibility;
  order?: number;
}

export interface ContentCategory {
  id: string;
  name: string;
  description?: string;
  count: number;
  parentId?: string;
}

export interface ContentUpload {
  title: string;
  description: string;
  format: ContentFormat;
  file?: File;
  resourceUrl?: string;
  tags: string[];
  accessLevel: AccessLevel;
  thumbnailFile?: File;
  thumbnailUrl?: string;
  categoryId?: string;
  visibility?: ContentVisibility;
}
