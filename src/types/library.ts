
export type ContentFormat = 'video' | 'pdf' | 'link' | 'audio' | 'image' | 'text' | 'youtube' | 'vimeo' | 'gdoc' | 'gdrive' | 'course';
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
  modules?: string[]; // IDs of modules for courses
  // Points system integration
  pointsEnabled: boolean;
  pointsValue: number;
  completionCriteria?: 'view' | 'scroll_end' | 'watch_percent' | 'time_spent';
  completionThreshold?: number; // e.g., 80% for watch_percent, 120 for time_spent (seconds)
}

export interface ContentProgress {
  userId: string;
  contentId: string;
  progress: number; // 0-100
  completed: boolean;
  lastInteractedAt: string;
  pointsAwarded: boolean;
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

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  modules: CourseModule[];
  accessLevel: AccessLevel;
  visibility?: ContentVisibility;
  createdAt: string;
  updatedAt: string;
  views: number;
  featured?: boolean;
  categoryId?: string;
  tags: string[];
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  contentItems: string[]; // IDs of content items
  order: number;
  duration?: string;
}
