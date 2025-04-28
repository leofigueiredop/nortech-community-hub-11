
export interface DiscussionTopic {
  id: string;
  community_id: string;
  name: string;
  description?: string;
  icon?: string;
  created_at: string;
  updated_at: string;
  space_id?: string;
}

export interface Discussion {
  id: string;
  title: string;
  content: string;
  topic_id: string;
  author_id: string;
  author?: {
    id: string;
    name: string;
    avatar_url?: string;
  };
  created_at: string;
  updated_at: string;
  is_pinned: boolean;
  view_count: number;
  is_closed: boolean;
  community_id: string;
  tags?: string[];
  format?: 'question' | 'discussion' | 'announcement';
  isHot?: boolean;
  isAnswered?: boolean;
  lastActivity?: string;
  upvotes?: number;
  replies?: DiscussionReply[];
  replies_count?: number;
  description?: string;
}

export interface DiscussionReply {
  id: string;
  content: string;
  discussion_id: string;
  author_id: string;
  author?: {
    id: string;
    name: string;
    avatar_url?: string;
  };
  created_at: string;
  updated_at: string;
  is_solution: boolean;
  upvotes?: number;
  downvotes?: number;
}

export interface DiscussionReaction {
  id: string;
  user_id: string;
  target_id: string; // Can be discussion_id or reply_id
  target_type: 'discussion' | 'reply';
  reaction_type: 'upvote' | 'downvote' | 'heart' | 'laugh' | 'sad' | 'angry';
  created_at: string;
}

export interface DiscussionFilter {
  id: string;
  type: 'tag' | 'status' | 'time' | 'format';
  value: string;
  label: string;
}
