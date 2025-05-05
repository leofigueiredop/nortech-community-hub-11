import { ContentFormat as BaseContentFormat, ContentCategory as BaseContentCategory, ContentItem } from './content';

// Re-export ContentFormat to avoid conflicts
export type ContentFormat = BaseContentFormat;

export interface ContentCategory extends BaseContentCategory {
  itemCount?: number;
  icon?: string;
}

// Add UUID type at the top
type UUID = string; // Type alias for UUID strings

export interface LibraryContentItem extends ContentItem {
  // Required fields from base interface
  createdAt: string;
  updatedAt: string;
  created_at: string;
  updated_at: string;
  views: number;
  visibility: 'public' | 'private';
  featured: boolean;
  community_id: UUID;
  
  // Optional fields specific to library content
  author_id?: UUID;
  is_featured?: boolean;
  likes?: number;
  duration?: number;
  access_level: 'free' | 'premium' | 'unlockable';
  category_id?: string;
  tags?: string[];
  
  // Additional properties needed by components
  isNew?: boolean;
  pointsEnabled?: boolean;
  pointsValue?: number;
  freeAccessesLeft?: number;
  isExclusive?: boolean;
  author?: {
    id: UUID;
    name: string;
    avatar?: string;
  } | UUID | null;
  
  // Properties used in various components
  resourceUrl?: string;
  completionCriteria?: 'view' | 'scroll_end' | 'watch_percent' | 'time_spent';
  completionThreshold?: number;
  fileSize?: number;
  allowComments?: boolean;
  space_id?: UUID;
}

// Course-related types
export interface CourseModuleItem {
  id: string;
  title: string;
  description?: string;
  type: string;
  content?: string;
  contentId?: string;
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

// Content progress tracking types
export interface ContentProgress {
  id: UUID;
  user_id: UUID;
  content_id: UUID;
  progress_percent: number;
  completed_at?: string | null;
  last_accessed_at: string;
  points_awarded: boolean;
  // Add aliases for consistent access
  userId?: UUID;
  contentId?: UUID;
  progress?: number;
  completed?: boolean;
  lastAccessedAt?: string;
  pointsAwarded?: boolean;
}

// Content interaction types
export interface ContentInteraction {
  id: UUID;
  user_id: UUID;
  content_id: UUID;
  interaction_type: 'view' | 'like' | 'share' | 'download';
  created_at: string;
}

// Content comment types
export interface ContentComment {
  id: UUID;
  user_id: UUID;
  content_id: UUID;
  comment: string;
  created_at: string;
  updated_at?: string;
  parent_id?: UUID;
  author?: {
    id: UUID;
    name: string;
    avatar?: string;
  };
}
