export type ContentFormat = 'video' | 'audio' | 'pdf' | 'text' | 'url' | 'youtube' | 'vimeo' | 'gdoc';

export interface ContentCategory {
  id: string;
  name: string;
  description: string;
  count: number;
  createdAt: string;
  updatedAt: string;
}

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  content: string;
  format: ContentFormat;
  tags: string[];
  accessLevel: 'free' | 'premium' | 'unlockable';
  featured?: boolean;
  isTopTen?: boolean; // New field for top 10 content
  createdAt: string;
  updatedAt: string;
  views: number;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  duration?: number;
  fileSize?: number;
  downloadUrl?: string;
  categoryId?: string;
  pointsEnabled?: boolean;
  pointsValue?: number;
  freeAccessesLeft?: number;
}
