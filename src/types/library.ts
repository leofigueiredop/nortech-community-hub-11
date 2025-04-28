
export interface ContentCategory {
  id: string;
  name: string;
  description?: string;
  slug: string;
  parent_id?: string;
  icon?: string;
  created_at: string;
  updated_at: string;
}

export interface ContentItem {
  id: string;
  title: string;
  description?: string;
  content?: string;
  format: string;
  url?: string;
  thumbnail?: string;
  duration?: number;
  author?: string;
  category_id?: string;
  tags?: string[];
  access_level: string;
  is_featured?: boolean;
  views?: number;
  created_at: string;
  updated_at: string;
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
