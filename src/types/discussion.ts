
export interface DiscussionUser {
  id: string;
  name: string;
  avatar: string;
  role?: string;
  level?: number;
  xp?: number;
  badges?: DiscussionBadge[];
}

export interface DiscussionBadge {
  id: string;
  name: string;
  description: string;
  icon?: string;
  category?: 'achievement' | 'participation' | 'moderation' | 'custom';
}

export interface DiscussionTopic {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  discussionCount: number;
  memberCount: number;
  recentActivity: string;
  slug: string;
  createdAt: string;
  createdBy: string;
  pinnedDiscussions?: Discussion[];
  isActive?: boolean;
}

export interface Discussion {
  id: string;
  title: string;
  description: string;
  author: DiscussionUser;
  createdAt: string;
  lastActivity: string;
  replies: number;
  participants: number;
  tags: string[];
  isHot?: boolean;
  isPinned?: boolean;
  isLocked?: boolean;
  isAnswered?: boolean;
  viewCount?: number;
  upvotes?: number;
  downvotes?: number;
  format?: 'discussion' | 'question' | 'announcement';
}

export interface DiscussionReply {
  id: string;
  content: string;
  author: DiscussionUser;
  createdAt: string;
  upvotes: number;
  isAcceptedAnswer?: boolean;
  parentId?: string;
  attachments?: string[];
}

export interface DiscussionFilter {
  type: 'tag' | 'status' | 'time' | 'author' | 'format';
  value: string;
  label: string;
}
