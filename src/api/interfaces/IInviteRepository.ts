export interface InviteData {
  id: string;
  email: string;
  role: string;
  community_id: string;
  invited_by: string; // UUID string referencing auth.users.id
  status: 'pending' | 'accepted' | 'expired';
  created_at: string;
  expires_at: string;
}

export interface IInviteRepository {
  /**
   * Create a new invitation
   */
  createInvite(email: string, role: string, invitedBy: string): Promise<{ data?: InviteData; error?: any }>;

  /**
   * Get invitation by email and community
   */
  getInvite(email: string, communityId: string): Promise<{ data?: InviteData; error?: any }>;

  /**
   * Accept an invitation
   */
  acceptInvite(inviteId: string, userId: string): Promise<{ data?: boolean; error?: any }>;

  /**
   * Check if invitation is valid
   */
  validateInvite(email: string, communityId: string): Promise<{ data?: boolean; error?: any }>;

  /**
   * Get all pending invitations for a community
   */
  getPendingInvites(): Promise<{ data?: InviteData[]; error?: any }>;

  /**
   * Cancel/delete an invitation
   */
  cancelInvite(inviteId: string): Promise<{ data?: boolean; error?: any }>;
} 