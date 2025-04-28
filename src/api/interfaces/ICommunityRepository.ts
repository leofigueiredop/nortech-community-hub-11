
// Define and export the Community interface so it can be used elsewhere
export interface Community {
  id: string;
  name: string;
  description?: string;
  slug: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
  logo_url?: string;
  banner_url?: string;
  is_private: boolean;
  access_code?: string;
  domain?: string;
  custom_domain?: string;
  status: 'active' | 'inactive' | 'pending';
  theme?: {
    primary_color?: string;
    secondary_color?: string;
    accent_color?: string;
    logo_position?: 'left' | 'center';
    font_family?: string;
  };
  settings?: Record<string, any>;
  analytics?: {
    member_count?: number;
    activity_score?: number;
    engagement_rate?: number;
  };
  features?: string[];
}

export interface ICommunityRepository {
  getCommunity(id: string): Promise<Community>;
  getCommunityBySlug(slug: string): Promise<Community>;
  createCommunity(data: Partial<Community>): Promise<Community>;
  updateCommunity(id: string, data: Partial<Community>): Promise<Community>;
  deleteCommunity(id: string): Promise<void>;
  listCommunities(userId?: string): Promise<Community[]>;
  joinCommunity(communityId: string, userId: string): Promise<void>;
  leaveCommunity(communityId: string, userId: string): Promise<void>;
  isMember(communityId: string, userId: string): Promise<boolean>;
}
