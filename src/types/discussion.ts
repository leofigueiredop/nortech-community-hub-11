
import { ContentFormat } from "./content";

export type DiscussionFilter = {
  type: 'tag' | 'status' | 'time' | 'format' | 'topic';
  value: string;
  label?: string;
  id?: string;
};

export interface DiscussionTopic {
  id: string;
  title: string;
  description: string;
  community_id: string;
  icon: string;
  color: string;
  slug: string;
  is_featured: boolean;
  is_private: boolean;
  access_level: 'free' | 'premium' | 'premium_plus';
  created_at: string;
  updated_at: string;
  
  // UI specific properties
  createdAt?: string;
  discussionCount?: number;
  memberCount?: number;
  recentActivity?: string;
  name?: string; // Added for backward compatibility
  createdBy?: string;
}

export interface Discussion {
  id: string;
  topic_id: string;
  user_id: string;
  community_id?: string; // Added for compatibility with repository
  title: string;
  description: string;
  content?: string;
  tags: string[];
  format: 'question' | 'discussion' | 'announcement';
  is_pinned?: boolean;
  is_locked?: boolean;
  is_featured?: boolean;
  is_anonymous?: boolean;
  votes?: number;
  upvotes?: number;
  downvotes?: number;
  view_count?: number;
  views?: number;
  likes?: number;
  comments?: number;
  replies?: number | DiscussionComment[];
  participants?: number;
  created_at: string;
  updated_at: string;
  
  // UI-specific properties
  isHot?: boolean;
  isAnswered?: boolean;
  lastActivity?: string;
  author?: {
    id: string;
    name: string;
    avatar?: string;
    avatar_url?: string; // Added for compatibility
    role?: string;
    level?: number;
    xp?: number;
  };
  topicId?: string; // For UI compatibility
}

export interface DiscussionComment {
  id: string;
  discussion_id: string;
  user_id: string;
  content: string;
  parent_id?: string;
  is_answer: boolean;
  likes: number;
  created_at: string;
  updated_at: string;
  author?: {
    id: string;
    name: string;
    avatar?: string;
    role?: string;
  };
}

// Adding needed types that were missing
export interface DiscussionReply {
  id: string;
  discussion_id: string;
  user_id: string;
  content: string;
  parent_id?: string;
  is_solution?: boolean;
  upvotes: number;
  created_at: string;
  author?: {
    id: string;
    name: string;
    avatar?: string;
    level?: number;
    xp?: number;
  };
  isAcceptedAnswer?: boolean;
}

export interface DiscussionVote {
  id: string;
  discussion_id: string;
  user_id: string;
  is_upvote: boolean;
  created_at: string;
}

export interface DiscussionBadge {
  id: string;
  name: string;
  description: string;
  category: 'participation' | 'achievement' | 'moderation';
}

export interface DiscussionUser {
  id: string;
  name: string;
  avatar?: string;
  level?: number;
  xp?: number;
}
