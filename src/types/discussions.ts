export type ReactionType = 'like' | 'love' | 'laugh' | 'wow' | 'sad' | 'angry';

export interface PostReaction {
  id: string;
  post_id: string;
  user_id: string;
  reaction_type: ReactionType;
  created_at: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author_id: string;
  community_id: string;
  created_at: string;
  updated_at: string;
  media_urls?: string[];
  is_featured?: boolean;
  tags?: string[];
  type: string;
  status: 'published' | 'draft' | 'archived';
  view_count: number;
  comment_count: number;
  space_id?: string;
  pinned?: boolean;
  expires_at?: string;
  visibility: 'public' | 'private' | 'members';
  location?: {
    type: string;
    coordinates: [number, number];
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
}

export interface ReactionCount {
  reaction_type: ReactionType;
  count: number;
} 