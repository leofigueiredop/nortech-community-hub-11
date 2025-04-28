
import { Community, CommunitySettings, CommunityMember } from '@/types/community';

export interface ICommunityRepository {
  getCommunityById(id: string): Promise<Community>;
  getCommunityByDomain(domain: string): Promise<Community | null>;
  createCommunity(community: Partial<Community>): Promise<Community>;
  updateCommunity(id: string, community: Partial<Community>): Promise<Community>;
  getSettings(type: string): Promise<CommunitySettings>;
  updateSettings(type: string, settings: any): Promise<CommunitySettings>;
  getMemberById(userId: string): Promise<CommunityMember | null>;
  addMember(member: Partial<CommunityMember>): Promise<CommunityMember>;
  updateMember(userId: string, member: Partial<CommunityMember>): Promise<CommunityMember>;
  removeMember(userId: string): Promise<void>;
  getAllMembers(page?: number, limit?: number): Promise<{ members: CommunityMember[], total: number }>;
}
