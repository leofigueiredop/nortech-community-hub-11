import { ContentFormat } from "./content";

// Add UUID type at the top
type UUID = string; // Type alias for UUID strings

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
  id: UUID;
  topic_id: UUID;
  user_id: UUID;
  community_id?: UUID;
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
  createdAt?: string; // Added for UI compatibility
  
  // UI-specific properties
  isHot?: boolean;
  isAnswered?: boolean;
  lastActivity?: string;
  author?: {
    id: UUID;
    name: string;
    avatar?: string;
    avatar_url?: string;
    role?: string;
    level?: number;
    xp?: number;
  };
  topicId?: UUID; // For UI compatibility
}

export interface DiscussionComment {
  id: UUID;
  discussion_id: UUID;
  user_id: UUID;
  content: string;
  parent_id?: UUID;
  is_answer: boolean;
  likes: number;
  created_at: string;
  updated_at: string;
  author?: {
    id: UUID;
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
  is_answer?: boolean; // Add this property to match the code
  upvotes: number;
  created_at: string;
  createdAt?: string; // Adding for UI compatibility
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
  id: UUID;
  discussion_id: UUID;
  user_id: UUID;
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
  id: UUID;
  name: string;
  avatar?: string;
  level?: number;
  xp?: number;
}
