import { Result } from '@/types/api';

// Define and export the Community interface so it can be used elsewhere
export interface Community {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  banner_url?: string;
  domain?: string;
  creator_id: string;
  created_at: string;
  updated_at: string;
  status: 'active' | 'inactive' | 'pending';
  theme_config: Record<string, any>;
  api_keys: Record<string, any>;
  is_private: boolean;
  member_count?: number;
  category?: string;
  slug?: string;
}

export interface ICommunityRepository {
  searchCommunities(
    query: string,
    filters?: {
      is_private?: boolean;
      status?: string;
      category?: string;
    }
  ): Promise<Result<Community[]>>;
  
  getFeaturedCommunities(): Promise<Result<Community[]>>;
  
  getCommunityById(id: string): Promise<Result<Community>>;
  
  getCommunityBySlug(slug: string): Promise<Result<Community>>;
  
  createCommunity(data: Partial<Community>): Promise<Result<Community>>;
  
  updateCommunity(id: string, data: Partial<Community>): Promise<Result<Community>>;
  
  deleteCommunity(id: string): Promise<Result<void>>;
  
  joinCommunity(communityId: string, userId: string): Promise<Result<void>>;
  
  isMember(communityId: string, userId: string): Promise<Result<boolean>>;
  
  getAllMembers(communityId: string): Promise<Result<string[]>>;
}
