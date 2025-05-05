// Add UUID type at the top
type UUID = string; // Type alias for UUID strings

export type ModerationStatus = 'pending' | 'reviewed' | 'resolved';

export type ModerationAction = {
  type: 'remove' | 'restore' | 'warn' | 'ban';
  duration?: number; // Duration in days for temporary bans
  notes?: string;
};

export type ModerationFlag = {
  id: UUID;
  contentId: UUID;
  contentType: 'post' | 'comment';
  reason: string;
  reporterId: UUID;
  reportedAt: Date;
  status: ModerationStatus;
  communityId: UUID;
  moderatorId?: UUID;
  reviewedAt?: Date;
  action?: ModerationAction;
}; 