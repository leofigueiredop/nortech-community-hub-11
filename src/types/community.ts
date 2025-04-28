
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
  theme_config?: {
    primaryColor?: string;
    secondaryColor?: string;
    fontFamily?: string;
    customCss?: string;
  };
  api_keys?: {
    stripe?: string;
    googleAnalytics?: string;
    mailchimp?: string;
  };
}

export interface CommunitySettings {
  id: string;
  community_id: string;
  settings_type: string;
  settings_data: any;
  created_at: string;
  updated_at: string;
}

export interface CommunityMember {
  id: string;
  community_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'moderator' | 'member';
  status: 'active' | 'pending' | 'suspended';
  subscription_plan_id?: string;
  joined_at: string;
  subscription_start_date?: string;
  subscription_end_date?: string;
  custom_fields?: {
    bio?: string;
    interests?: string[];
    socialLinks?: {
      type: string;
      url: string;
    }[];
    [key: string]: any;
  };
  created_at: string;
  updated_at: string;
}

export interface Space {
  id: string;
  community_id: string;
  name: string;
  description?: string;
  type: 'forum' | 'library' | 'events' | 'courses' | 'posts' | 'ai' | 'challenge';
  icon?: string;
  banner_url?: string;
  config?: any;
  visibility: 'public' | 'members' | 'premium' | 'private';
  created_at: string;
  updated_at: string;
}

export interface SubscriptionPlan {
  id: string;
  community_id: string;
  name: string;
  description?: string;
  price: number;
  interval: 'month' | 'year' | 'one_time';
  features?: string[];
  is_active: boolean;
  trial_days?: number;
  max_members?: number;
  visibility: 'public' | 'private' | 'hidden';
  progressive_content: boolean;
  retention_days?: number;
  created_at: string;
  updated_at: string;
}

export interface PaymentGateway {
  id: string;
  community_id: string;
  gateway_type: 'stripe' | 'paypal' | 'manual';
  is_active: boolean;
  config?: {
    publishableKey?: string;
    webhookSecret?: string;
    [key: string]: any;
  };
  created_at: string;
  updated_at: string;
}

// Add mockCommunities data for development and testing
export const mockCommunities: Community[] = [
  {
    id: 'comm-1',
    name: 'Design Masters',
    description: 'A community for UI/UX designers to share work and get feedback',
    logo_url: 'https://via.placeholder.com/150',
    banner_url: 'https://via.placeholder.com/800x200',
    domain: 'design-masters.com',
    creator_id: 'user-123',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status: 'active',
    theme_config: {
      primaryColor: '#7E69AB',
    }
  },
  {
    id: 'comm-2',
    name: 'Web3 Explorers',
    description: 'Exploring the frontiers of blockchain and web3 technology',
    logo_url: 'https://via.placeholder.com/150',
    banner_url: 'https://via.placeholder.com/800x200',
    domain: 'web3-explorers.com',
    creator_id: 'user-456',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status: 'active',
    theme_config: {
      primaryColor: '#3B82F6',
    }
  },
  {
    id: 'comm-3',
    name: 'Creator Economy',
    description: 'For content creators building their business online',
    logo_url: 'https://via.placeholder.com/150',
    banner_url: 'https://via.placeholder.com/800x200',
    domain: 'creator-economy.com',
    creator_id: 'user-789',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status: 'active',
    theme_config: {
      primaryColor: '#F97316',
    }
  }
];
