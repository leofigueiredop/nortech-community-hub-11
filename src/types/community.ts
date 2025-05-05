// Add UUID type at the top
type UUID = string; // Type alias for UUID strings

export interface Community {
  id: UUID;
  name: string;
  description?: string;
  logo_url?: string;
  banner_url?: string;
  domain?: string;
  creator_id: UUID;
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

export interface CommunitySettings {
  id: string;
  community_id: string;
  type: string;
  settings: any;
  created_at: string;
  updated_at: string;
}

export interface CommunityMember {
  id: UUID;
  community_id: UUID;
  user_id: UUID;
  role: 'owner' | 'admin' | 'moderator' | 'member';
  status: 'active' | 'pending' | 'banned';
  joined_at: string;
  points: number;
  created_at: string;
  updated_at: string;
  profile?: {
    name: string;
    avatar_url?: string;
    email?: string;
  };
}

export const mockCommunities: Community[] = [
  {
    id: "comm-1",
    name: "Nortech",
    slug: "nortech",
    description: "A technology learning community",
    logo_url: "https://placehold.co/150",
    banner_url: "https://placehold.co/1200x300",
    primary_color: "#6E56CF",
    secondary_color: "#4A36A0",
    is_public: true,
    owner_id: "user-1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];
