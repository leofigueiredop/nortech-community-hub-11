
export interface CommunitySettings {
  id?: string;
  community_id: string;
  settings_type: string;
  settings_data: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface Community {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  banner_url?: string;
  domain?: string;
  creator_id: string;
  created_at?: string;
  updated_at?: string;
  status?: 'active' | 'inactive' | 'suspended';
  theme_config?: Record<string, any>;
  api_keys?: Record<string, any>;
}

export interface CommunityMember {
  id?: string;
  community_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'moderator' | 'member';
  status: 'active' | 'pending' | 'suspended';
  subscription_plan_id?: string;
  joined_at?: string;
  subscription_start_date?: string;
  subscription_end_date?: string;
  custom_fields?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface SubscriptionPlan {
  id?: string;
  community_id: string;
  name: string;
  description?: string;
  price: number | null;
  interval: 'month' | 'quarter' | 'year' | 'one-time';
  features?: Array<string> | Record<string, boolean>;
  is_active: boolean;
  trial_days?: number;
  max_members?: number;
  visibility: 'public' | 'private' | 'invite';
  progressive_content?: boolean;
  retention_days?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ICommunityRepository {
  // Community management
  getCommunity(id: string): Promise<Community>;
  createCommunity(community: Partial<Community>): Promise<Community>;
  updateCommunity(id: string, community: Partial<Community>): Promise<Community>;
  deleteCommunity(id: string): Promise<void>;
  getCommunityByDomain(domain: string): Promise<Community | null>;
  getUserCommunities(userId: string): Promise<Community[]>;
  
  // Community settings
  getSettings(communityId: string, settingsType: string): Promise<CommunitySettings>;
  updateSettings(communityId: string, settingsType: string, settings: Record<string, any>): Promise<CommunitySettings>;
  
  // Community members
  getMembers(communityId: string, params?: { role?: string, status?: string }): Promise<CommunityMember[]>;
  getMember(communityId: string, userId: string): Promise<CommunityMember | null>;
  addMember(member: CommunityMember): Promise<CommunityMember>;
  updateMember(communityId: string, userId: string, updates: Partial<CommunityMember>): Promise<CommunityMember>;
  removeMember(communityId: string, userId: string): Promise<void>;
  
  // Subscription plans
  getSubscriptionPlans(communityId: string, includeInactive?: boolean): Promise<SubscriptionPlan[]>;
  createSubscriptionPlan(plan: SubscriptionPlan): Promise<SubscriptionPlan>;
  updateSubscriptionPlan(id: string, plan: Partial<SubscriptionPlan>): Promise<SubscriptionPlan>;
  deleteSubscriptionPlan(id: string): Promise<void>;
}
