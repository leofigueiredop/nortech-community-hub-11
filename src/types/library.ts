
import { ContentFormat, ContentCategory as BaseContentCategory } from './content';

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
  access_level?: string;
  accessLevel?: string;
  is_featured?: boolean;
  featured?: boolean;
  views?: number;
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
  pointsEnabled?: boolean;
  pointsValue?: number;
  allowComments?: boolean;
  community_id?: string;
  isNew?: boolean;
  visibility?: string;
  completionCriteria?: string;
  completionThreshold?: number;
  resourceUrl?: string;
  fileSize?: number;
  freeAccessesLeft?: number;
}

export interface ContentInteraction {
  id: string;
  user_id: string;
  content_id: string;
  type: string;
  percentage_complete?: number;
  created_at: string;
  updated_at: string;
}

export interface ContentComment {
  id: string;
  user_id: string;
  content_id: string;
  parent_id?: string;
  message: string;
  created_at: string;
  updated_at: string;
}

export interface ContentProgress {
  id: string;
  userId: string;
  contentId: string;
  progress: number;
  completed: boolean;
  lastAccessedAt: string;
  pointsAwarded: boolean;
  progress_percent?: number;
  completed_at?: string;
  last_accessed_at?: string;
  points_awarded?: boolean;
  user_id?: string;
  content_id?: string;
}

export interface CourseModule {
  id: string;
  title: string;
  description?: string;
  order?: number;
  items: CourseModuleItem[];
}

export interface CourseModuleItem {
  id: string;
  title: string;
  type: 'video' | 'document' | 'quiz' | 'exercise' | 'text';
  duration?: number;
  completed?: boolean;
  url?: string;
  content?: string;
}

export interface Course extends ContentItem {
  modules: CourseModule[];
  totalDuration?: number;
  progress?: number;
  completedLessons?: number;
  totalLessons?: number;
}

export type ContentFormat = 
  | 'video'
  | 'audio'
  | 'pdf'
  | 'document'
  | 'course'
  | 'image'
  | 'text'
  | 'link'
  | 'youtube'
  | 'vimeo'
  | 'gdoc'
  | string;
