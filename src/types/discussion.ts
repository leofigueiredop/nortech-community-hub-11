
import { ContentFormat } from "./content";

export type DiscussionFilter = {
  type: 'tag' | 'status' | 'time' | 'format';
  value: string;
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
  access_level: 'free' | 'premium' | 'premium_plus'; // Added explicit types
  created_at: string;
  updated_at: string;
  createdAt?: string;
  discussionCount?: number;
  memberCount?: number;
  recentActivity?: string;
}

export interface Discussion {
  id: string;
  topic_id: string;
  user_id: string;
  title: string;
  description: string;
  content?: string;
  tags: string[];
  format: 'question' | 'discussion' | 'announcement';
  is_pinned: boolean;
  is_locked: boolean;
  views: number;
  likes: number;
  comments: number;
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
    role?: string;
  };
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
