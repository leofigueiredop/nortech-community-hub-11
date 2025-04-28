
export interface DiscussionTopic {
  id: string;
  community_id: string;
  title: string;
  description?: string;
  icon?: string;
  color?: string;
  slug?: string;
  is_featured: boolean;
  is_private: boolean;
  access_level: 'free' | 'premium' | 'premium_plus';
  createdAt?: string; // For compatibility with existing code
  discussionCount?: number; // For compatibility with existing code
  memberCount?: number; // For compatibility with existing code
  recentActivity?: string; // For compatibility with existing code
  created_at: string;
  updated_at: string;
}

export interface Discussion {
  id: string;
  community_id: string;
  topic_id: string;
  user_id: string;
  title: string;
  content: string;
  format: 'question' | 'discussion' | 'announcement';
  is_locked: boolean;
  is_featured: boolean;
  is_anonymous: boolean;
  tags?: string[];
  votes: number;
  view_count: number;
  // For compatibility with existing code
  author?: {
    id: string;
    name: string;
    avatar_url?: string;
    level?: number;
    xp?: number;
  };
  lastActivity?: string;
  createdAt?: string;
  viewCount?: number;
  isPinned?: boolean;
  participants?: any[];
  replies?: DiscussionReply[];
  created_at: string;
  updated_at: string;
}

export interface DiscussionReply {
  id: string;
  discussion_id: string;
  user_id: string;
  content: string;
  is_solution: boolean;
  parent_id?: string;
  votes: number;
  created_at: string;
  updated_at: string;
  // For compatibility with existing code
  author?: {
    id: string;
    name: string;
    avatar_url?: string;
    level?: number; 
    xp?: number;
  };
}

export interface DiscussionVote {
  id: string;
  user_id: string;
  entity_id: string; // Either discussion_id or reply_id
  entity_type: 'discussion' | 'reply';
  vote_type: 'up' | 'down';
  created_at: string;
}

export interface DiscussionFilter {
  id: string;
  type: 'topic' | 'format' | 'tag' | 'status';
  value: string;
  label: string;
}
