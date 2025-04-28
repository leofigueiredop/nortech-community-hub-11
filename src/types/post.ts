
export interface Post {
  id: string;
  title: string;
  content: string;
  author_id: string;
  community_id: string;
  created_at: string;
  updated_at: string;
  media_urls?: string[];
  is_featured: boolean;
  tags?: string[];
  type: 'text' | 'image' | 'video' | 'link' | 'poll';
  status: 'published' | 'draft' | 'archived';
  view_count: number;
  comment_count: number;
  space_id?: string;
  pinned: boolean;
  author?: {
    id: string;
    name: string;
    avatar_url?: string;
  };
  comments?: PostComment[];
  reactions_count?: number;
  reactions?: {
    [key: string]: number;
  };
  expires_at?: string;
  visibility?: 'public' | 'members' | 'premium';
  location?: {
    lat?: number;
    lng?: number;
    address?: string;
  };
}

export interface PostComment {
  id: string;
  post_id: string;
  content: string;
  author_id: string;
  created_at: string;
  updated_at: string;
  parent_id?: string;
  author?: {
    id: string;
    name: string;
    avatar_url?: string;
  };
}

export interface PostReaction {
  id: string;
  post_id: string;
  user_id: string;
  reaction_type: string;
  created_at: string;
}

export interface PostFilter {
  type: 'tag' | 'status' | 'author' | 'date' | 'featured';
  value: string;
}
