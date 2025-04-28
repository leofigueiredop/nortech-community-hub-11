
export type ContentFormat = 'video' | 'pdf' | 'audio' | 'image' | 'link' | 'text' | 'course' | 'ebook' | 'webinar';

export interface ContentCategory {
  id: string;
  name: string;
  description?: string;
  itemCount: number;
  icon: string;
}

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  format: ContentFormat;
  thumbnail?: string;
  author: string | {
    id: string;
    name: string;
    avatar?: string;
  };
  tags: string[];
  created_at: string;
  updated_at: string;
  views: number;
  duration?: number;
  accessLevel: 'free' | 'premium' | 'premium_plus';
  featured?: boolean;
  categoryId?: string;
  allowComments?: boolean;
  freeAccessesLeft?: number;
  isNew?: boolean;
  isExclusive?: boolean;
  pointsEnabled?: boolean;
  pointsValue?: number;
  
  // Course specific fields
  modules?: CourseModule[];
}

export interface CourseModule {
  id: string;
  title: string;
  items: ModuleItem[];
}

export interface ModuleItem {
  id: string;
  title: string;
  type: 'video' | 'text' | 'quiz' | 'assignment';
  contentId: string;
  completed?: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  accessLevel: 'free' | 'premium' | 'premium_plus';
  modules: CourseModule[];
}

export interface ContentProgress {
  id: string;
  user_id: string;
  content_id: string;
  progress_percent: number;
  completed_at?: string;
  last_accessed_at: string;
  points_awarded: boolean;
}
