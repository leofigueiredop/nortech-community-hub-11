
export interface ContentItem {
  id: string;
  community_id: string;
  title: string;
  description?: string;
  format: 'video' | 'audio' | 'pdf' | 'document' | 'link' | 'image' | 'course';
  thumbnail?: string;
  thumbnail_url?: string;
  resource_url?: string;
  author?: string;
  duration?: number;
  tags: string[];
  access_level: 'free' | 'premium';
  created_at: string;
  updated_at: string;
  views: number;
  category_id?: string;
  visibility: 'public' | 'members' | 'premium' | 'private';
  featured: boolean;
  points_enabled: boolean;
  points_value: number;
  completion_criteria: 'view' | 'percent' | 'quiz';
  completion_threshold: number;
  file_size?: number;
  space_id?: string;
}

export interface ContentCategory {
  id: string;
  community_id: string;
  name: string;
  description?: string;
  parent_id?: string;
  created_at: string;
  sort_order: number;
}

export interface ContentInteraction {
  id: string;
  content_id: string;
  user_id: string;
  community_id: string;
  interaction_type: 'view' | 'completion' | 'like' | 'bookmark' | 'comment' | 'share';
  interaction_data?: {
    percent?: number;
    comment?: string;
    rating?: number;
    [key: string]: any;
  };
  created_at: string;
  updated_at: string;
}
