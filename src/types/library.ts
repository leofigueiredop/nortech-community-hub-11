
import { ContentFormat as BaseContentFormat, ContentCategory as BaseContentCategory } from './content';

// Re-export ContentFormat to avoid conflicts
export type ContentFormat = BaseContentFormat;

export interface ContentCategory extends BaseContentCategory {
  itemCount?: number;
  icon?: string;
}

export interface ContentItem {
  id: string;
  title: string;
  description?: string;
  content?: string;
  format: ContentFormat | string;
  url?: string;
  thumbnail?: string;
  thumbnailUrl?: string;
  duration?: number;
  author?: string | {
    id: string;
    name: string;
    avatar?: string;
  } | null;
  category_id?: string;
  categoryId?: string;
  tags?: string[];
  access_level?: 'free' | 'premium' | 'premium_plus';
  accessLevel?: 'free' | 'premium' | 'premium_plus';
  is_featured?: boolean;
  featured?: boolean;
  views?: number;
  likes?: number;
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
  pointsEnabled?: boolean;
  pointsValue?: number;
  allowComments?: boolean;
  community_id?: string;
  fileSize?: string | number; // Make fileSize accept both string and number
  resourceUrl?: string;
  visibility?: string;
  completionCriteria?: string;
  completionThreshold?: number;
  isNew?: boolean;
  freeAccessesLeft?: number;
  isExclusive?: boolean; // Add isExclusive property to match mockLibraryData.ts
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
