import { Result } from '@/types/api';
import { UUID } from '@/types/common';

// Define and export the Community interface so it can be used elsewhere
export interface Community {
  id: UUID;
  name: string;
  description: string | null;
  slug: string | null;
  is_private: boolean;
  status: string;
  category: string;
  creator_id: UUID;
  domain: string | null;
  logo_url: string | null;
  banner_url: string | null;
  theme_config: any | null;
  api_keys: any | null;
  member_count: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICommunityRepository {
  searchCommunities(query: string, filters?: { 
    isPrivate?: boolean;
    status?: string;
    category?: string;
  }): Promise<Result<Community[]>>;
  
  getFeaturedCommunities(): Promise<Result<Community[]>>;
  
  getCommunityById(id: UUID): Promise<Result<Community>>;
  
  getCommunityBySlug(slug: string): Promise<Result<Community>>;
  
  createCommunity(data: Partial<Community>): Promise<Result<Community>>;
  
  updateCommunity(id: UUID, data: Partial<Community>): Promise<Result<Community>>;
  
  deleteCommunity(id: UUID): Promise<Result<void>>;
  
  joinCommunity(communityId: UUID, userId: UUID): Promise<Result<void>>;
  
  isMember(communityId: UUID, userId: UUID): Promise<Result<boolean>>;
  
  getAllMembers(communityId: UUID): Promise<Result<string[]>>;
}
