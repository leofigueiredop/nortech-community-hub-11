
export interface ContentCategory {
  id: string;
  community_id: string;
  name: string;
  description?: string;
  icon?: string;
  parent_id?: string;
  display_order?: number;
  created_at: string;
  updated_at: string;
}

export interface ContentItem {
  id: string;
  community_id: string;
  title: string;
  description?: string;
  content_type: 'video' | 'audio' | 'pdf' | 'document' | 'link' | 'image' | 'course' | 'text' | 'url' | 'youtube' | 'vimeo' | 'gdoc';
  thumbnail_url?: string;
  content_url?: string;
  file_size?: number;
  duration?: number;
  author_id?: string;
  category_id?: string;
  category?: ContentCategory;
  tags?: string[];
  visibility: 'public' | 'members' | 'premium' | 'hidden';
  access_level: 'free' | 'premium' | 'premium_plus';
  status: 'draft' | 'published' | 'archived';
  meta?: {
    source?: string;
    embed_code?: string;
    views?: number;
    downloads?: number;
  };
  points_enabled?: boolean;
  points_value?: number;
  free_accesses_left?: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
  accessLevel?: 'free' | 'premium' | 'premium_plus';
  pointsEnabled?: boolean;
  pointsValue?: number;
  freeAccessesLeft?: number;
  format?: string;
  thumbnail?: string;
  allowComments?: boolean;
}

// Course-specific types
export interface CourseModule {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  order: number;
  status: 'draft' | 'published' | 'archived';
  duration?: number; // In minutes
  created_at: string;
  updated_at: string;
  items?: CourseModuleItem[];
}

export interface CourseModuleItem {
  id: string;
  module_id: string;
  title: string;
  description?: string;
  content_type: 'video' | 'audio' | 'pdf' | 'document' | 'quiz' | 'assignment';
  content_url?: string;
  thumbnail_url?: string;
  duration?: number;
  order: number;
  is_required: boolean;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
  accessLevel?: 'free' | 'premium' | 'premium_plus';
  pointsEnabled?: boolean;
  pointsValue?: number;
  freeAccessesLeft?: number;
  type?: string;
  completed?: boolean;
  contentId?: string;
}

export interface Course extends ContentItem {
  modules?: CourseModule[];
  total_duration?: number;
  total_lessons?: number;
  completion_percentage?: number;
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  prerequisites?: string[];
  learning_objectives?: string[];
  certification?: boolean;
  instructor?: {
    id: string;
    name: string;
    bio?: string;
    avatar_url?: string;
  };
}

export interface ContentProgress {
  id: string;
  user_id: string;
  content_id: string;
  progress_percentage: number;
  last_position?: number;
  status: 'not_started' | 'in_progress' | 'completed';
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ContentView {
  id: string;
  user_id: string;
  content_id: string;
  viewed_at: string;
  view_duration?: number;
  device_info?: string;
  community_id: string;
}

export interface ContentInteraction {
  id: string;
  user_id: string;
  content_id: string;
  interaction_type: 'view' | 'like' | 'share' | 'download' | 'comment' | 'complete';
  interaction_data?: any;
  created_at: string;
}

export interface ContentComment {
  id: string;
  content_id: string;
  user_id: string;
  parent_id?: string;
  text: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    name: string;
    avatar_url?: string;
  };
}
