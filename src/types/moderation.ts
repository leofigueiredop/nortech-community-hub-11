export type ModerationStatus = 'pending' | 'reviewed' | 'resolved';

export type ModerationAction = {
  type: 'remove' | 'restore' | 'warn' | 'ban';
  duration?: number; // Duration in days for temporary bans
  notes?: string;
};

export type ModerationFlag = {
  id: string;
  contentId: string;
  contentType: 'post' | 'comment';
  reason: string;
  reporterId: string;
  reportedAt: Date;
  status: ModerationStatus;
  communityId: string;
  moderatorId?: string;
  reviewedAt?: Date;
  action?: ModerationAction;
}; 