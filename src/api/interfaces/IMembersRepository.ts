import { Result } from '@/types/api';
import { CommunityMember } from '@/types/community';

export interface MemberFilters {
  role?: string | string[];
  status?: string | string[];
  plan?: string | string[];
  search?: string;
  limit?: number;
  offset?: number;
}

export interface IMembersRepository {
  /**
   * Get all members of a community with filtering options
   */
  getAllMembers(filters?: MemberFilters): Promise<Result<CommunityMember[]>>;
  
  /**
   * Get a single member by ID
   */
  getMemberById(userId: string): Promise<Result<CommunityMember | null>>;
  
  /**
   * Update a member's role
   */
  updateMemberRole(userId: string, role: string): Promise<Result<void>>;
  
  /**
   * Get the total number of members in the community
   */
  getMembersCount(): Promise<Result<number>>;
  
  /**
   * Get the number of new members who joined in the specified time period
   */
  getNewMembersCount(days: number): Promise<Result<number>>;
  
  /**
   * Invite a new member to the community
   */
  inviteMember(email: string, role?: string): Promise<Result<void>>;
  
  /**
   * Remove a member from the community
   */
  removeMember(userId: string): Promise<Result<void>>;
} 