import { ContentFormat as BaseContentFormat, ContentCategory as BaseContentCategory, ContentItem } from './content';

// Re-export ContentFormat to avoid conflicts
export type ContentFormat = BaseContentFormat;

export interface ContentCategory extends BaseContentCategory {
  itemCount?: number;
  icon?: string;
}

export interface LibraryContentItem extends ContentItem {
  // Required fields from base interface
  createdAt: string;
  updatedAt: string;
  
  // Optional fields specific to library content
  created_at?: string; // Legacy field
  updated_at?: string; // Legacy field
  author_id?: string;
  is_featured?: boolean;
  views?: number;
  likes?: number;
  duration?: number;
  access_level: 'free' | 'premium' | 'premium_plus';
  category_id?: string;
  tags?: string[];
  
  // Additional properties needed by components
  isNew?: boolean;
  pointsEnabled?: boolean;
  pointsValue?: number;
  freeAccessesLeft?: number;
  isExclusive?: boolean;
  author?: {
    id: string;
    name: string;
    avatar?: string;
  } | string | null;
  
  // Properties used in various components
  resourceUrl?: string;
  visibility?: 'public' | 'premium' | 'points' | 'hidden' | 'vip-only' | 'limited-time';
  completionCriteria?: 'view' | 'scroll_end' | 'watch_percent' | 'time_spent';
  completionThreshold?: number;
  fileSize?: number | string;
  featured?: boolean;
  allowComments?: boolean;
}

// Course-related types
export interface CourseModuleItem {
  id: string;
  title: string;
  description?: string;
  type: string;
  content?: string;
  contentId?: string; // Add contentId for Course components
  duration?: number;
  completed?: boolean;
  url?: string;
  resourceUrl?: string;
}

export interface CourseModule {
  id: string;
  title: string;
  description?: string;
  items: CourseModuleItem[];
}

export interface Course extends ContentItem {
  modules?: CourseModule[];
}

// Content progress tracking types - update to match how it's used
export interface ContentProgress {
  id: string;
  user_id: string;
  content_id: string;
  progress_percent: number;
  completed_at?: string | null;
  last_accessed_at: string;
  points_awarded: boolean;
  // Add aliases for consistent access
  userId?: string;
  contentId?: string;
  progress?: number;
  completed?: boolean;
  lastAccessedAt?: string;
  pointsAwarded?: boolean;
}

// Content interaction types
export interface ContentInteraction {
  id: string;
  user_id: string;
  content_id: string;
  interaction_type: 'view' | 'like' | 'share' | 'download';
  created_at: string;
}

// Content comment types
export interface ContentComment {
  id: string;
  user_id: string;
  content_id: string;
  comment: string;
  created_at: string;
  updated_at?: string;
  parent_id?: string;
  author?: {
    id: string;
    name: string;
    avatar?: string;
  };
}
