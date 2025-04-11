
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
  thumbnailUrl: string;
  resourceUrl: string;
  format: string;
  tags: string[];
  views: number;
  duration?: string;
  accessLevel: 'free' | 'premium';
  featured?: boolean;
  categoryId?: string;
  createdAt: string;
  updatedAt: string;
  // Additional fields for premium content
  pointsEnabled?: boolean;
  pointsValue?: number;
  freeAccessesLeft?: number;
  exclusiveToPlan?: string;
  // Fields for content completion tracking
  completionCriteria?: 'watch_percent' | 'scroll_end' | 'time_spent' | 'view';
  completionThreshold?: number;
  // Additional metadata fields
  fileSize?: string;
  author?: string;
  allowComments?: boolean;
  // Add visibility property
  visibility?: 'public' | 'premium' | 'points' | 'hidden' | 'vip-only' | 'limited-time';
}

export type ContentFormat = 
  | 'video'
  | 'youtube'
  | 'vimeo'
  | 'pdf'
  | 'text'
  | 'gdoc'
  | 'gdrive'  // Added gdrive
  | 'audio'
  | 'image'
  | 'link'
  | 'course';  // Added course

export type AccessLevel = 'free' | 'premium';

export type ContentVisibility = 'public' | 'premium' | 'points' | 'hidden' | 'vip-only' | 'limited-time';

export interface ContentProgress {
  userId: string;
  contentId: string;
  progress: number;
  completed: boolean;
  lastAccessed: string;
  pointsAwarded?: boolean;  // Add pointsAwarded property
}

// Course interface is kept for backward compatibility
export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  modules: CourseModule[];
  accessLevel: 'free' | 'premium';
  createdAt: string;
  updatedAt: string;
  views: number;
  featured?: boolean;
  tags: string[];
}

// CourseModule interface is kept for backward compatibility
interface CourseModule {
  id: string;
  title: string;
  description: string;
  contentItems: string[];
  order: number;
  duration: string;
}
