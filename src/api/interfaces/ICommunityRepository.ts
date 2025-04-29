
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
  getCommunityById(id: string): Promise<Community>;
  getCommunityByDomain(domain: string): Promise<Community | null>;
  createCommunity(community: Partial<Community>): Promise<Community>;
  updateCommunity(id: string, community: Partial<Community>): Promise<Community>;
  getSettings(type: string): Promise<any>;
  updateSettings(type: string, settings: any): Promise<any>;
  getMemberById(userId: string): Promise<any | null>;
  addMember(member: any): Promise<any>;
  updateMember(userId: string, member: any): Promise<any>;
  removeMember(userId: string): Promise<void>;
  getAllMembers(page?: number, limit?: number): Promise<{ members: any[], total: number }>;
}
