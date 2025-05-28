// Add UUID type at the top
type UUID = string; // Type alias for UUID strings

export interface Post {
  id: UUID;
  title: string;
  content: string;
  author_id: UUID;
  community_id: UUID;
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
    id: UUID;
    full_name: string | null;
    avatar_url?: string | null;
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
  id: UUID;
  post_id: UUID;
  content: string;
  author_id: UUID;
  created_at: string;
  updated_at: string;
  parent_id?: string;
  author?: {
    id: UUID;
    full_name: string | null;
    avatar_url?: string | null;
  };
}

export interface PostReaction {
  id: UUID;
  post_id: UUID;
  user_id: UUID;
  reaction_type: string;
  created_at: string;
}

export interface PostFilter {
  type: 'tag' | 'status' | 'author' | 'date' | 'featured';
  value: string;
}
