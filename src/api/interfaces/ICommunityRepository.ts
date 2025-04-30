import { Result } from '@/types/api';

// Define and export the Community interface so it can be used elsewhere
export interface Community {
  id: string;
  name: string;
  description: string;
  slug: string;
  isPrivate: boolean;
  status: string;
  category: string;
  creatorId: string;
  creatorName: string;
  logo_url?: string;
  banner_url?: string;
  memberCount?: number;
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
  
  getCommunityById(id: string): Promise<Result<Community>>;
  
  getCommunityBySlug(slug: string): Promise<Result<Community>>;
  
  createCommunity(data: Partial<Community>): Promise<Result<Community>>;
  
  updateCommunity(id: string, data: Partial<Community>): Promise<Result<Community>>;
  
  deleteCommunity(id: string): Promise<Result<void>>;
  
  joinCommunity(communityId: string, userId: string): Promise<Result<void>>;
  
  leaveCommunity(communityId: string, userId: string): Promise<Result<void>>;
  
  getAllMembers(communityId: string): Promise<Result<string[]>>;
  
  isMember(communityId: string, userId: string): Promise<Result<boolean>>;
}
