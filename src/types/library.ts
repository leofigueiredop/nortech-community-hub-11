
export type ContentFormat = 'video' | 'audio' | 'pdf' | 'text' | 'url' | 'youtube' | 'vimeo' | 'gdoc' | 'image' | 'link' | 'gdrive' | 'course';

export type AccessLevel = 'free' | 'premium' | 'unlockable';
export type ContentVisibility = 'public' | 'premium' | 'points' | 'hidden' | 'vip-only' | 'limited-time';

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
  thumbnailUrl?: string; // For backward compatibility
  content?: string;
  format: ContentFormat;
  tags: string[];
  accessLevel: AccessLevel;
  featured?: boolean;
  isTopTen?: boolean; // Field for top 10 content
  createdAt: string;
  updatedAt: string;
  views: number;
  author?: {
    id: string;
    name: string;
    avatar?: string;
  };
  duration?: number | string;
  fileSize?: number | string;
  downloadUrl?: string;
  categoryId?: string;
  pointsEnabled?: boolean;
  pointsValue?: number;
  freeAccessesLeft?: number;
  resourceUrl?: string;
  visibility?: ContentVisibility;
  completionCriteria?: 'view' | 'scroll_end' | 'watch_percent' | 'time_spent';
  completionThreshold?: number;
  allowComments?: boolean;
}

export interface ContentProgress {
  id: string;
  contentId: string;
  userId: string;
  progress: number;
  completed: boolean;
  lastAccessedAt: string;
}
