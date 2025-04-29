export interface ContentItem {
  id: string;
  title: string;
  description?: string;
  format: ContentFormat;
  thumbnail?: string;
  thumbnailUrl?: string;
  url?: string;
  resourceUrl?: string;
  author?: string | ContentAuthor;
  duration?: number;
  views?: number;
  tags?: string[];
  category_id?: string;
  created_at?: string;
  updated_at?: string;
  is_featured?: boolean;
  featured?: boolean;
  access_level: 'free' | 'premium' | 'premium_plus' | 'unlockable';
  visibility?: 'public' | 'premium' | 'points' | 'hidden';
  points_value?: number;
  points_enabled?: boolean;
  completionCriteria?: 'view' | 'scroll_end' | 'watch_percent' | 'time_spent';
  completionThreshold?: number;
  fileSize?: number;
  isNew?: boolean;
  community_id?: string;
  
  // Legacy fields - keeping for compatibility
  // These should be accessed through their snake_case versions
  categoryId?: string;
  accessLevel?: 'free' | 'premium' | 'premium_plus' | 'unlockable';
}

export type ContentFormat = 'video' | 'document' | 'pdf' | 'audio' | 'image' | 'course' | 'link' | 'embed';

export interface ContentAuthor {
  id: string;
  name: string;
  avatar?: string;
}

export interface ContentCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  parent_id?: string;
  community_id?: string;
  item_count?: number;
}

export interface ContentProgress {
  id: string;
  user_id: string;
  content_id: string;
  progress_percent: number;
  completed_at: string | null;
  last_accessed_at: string;
  points_awarded: boolean;
}

export interface CourseModule {
  id: string;
  title: string;
  description?: string;
  order: number;
  items: CourseModuleItem[];
}

export interface CourseModuleItem {
  id: string;
  title: string;
  description?: string;
  type: 'video' | 'document' | 'quiz' | 'text';
  duration?: number;
  order: number;
  content_id?: string;
  module_id: string;
  is_required: boolean;
  content?: ContentItem;
}

// Helper adapter functions to maintain compatibility
export const adaptContentProgressForLegacy = (progress: ContentProgress) => {
  return {
    ...progress,
    contentId: progress.content_id,
    userId: progress.user_id,
    progress: progress.progress_percent,
    completed: progress.completed_at !== null,
    lastAccessedAt: progress.last_accessed_at,
    pointsAwarded: progress.points_awarded
  };
};

export const adaptContentItemForLegacy = (item: ContentItem) => {
  return {
    ...item,
    accessLevel: item.access_level,
    categoryId: item.category_id
  };
};

export const adaptContentCategoryForLegacy = (category: ContentCategory) => {
  return {
    ...category,
    itemCount: category.item_count
  };
};
