// Add UUID type at the top
type UUID = string; // Type alias for UUID strings

export interface Community {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  theme_config: {
    primaryColor: string;
  } | null;
  owner_id?: string;
  created_at?: string;
  updated_at?: string;
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
    description: "A technology learning community",
    logo_url: "https://placehold.co/150",
    theme_config: {
      primaryColor: "#6E56CF"
    },
    owner_id: "user-1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export interface CommunityContext {
  id: string;
  name: string;
  description?: string;
  logo_url?: string | null;
  theme_config?: {
    primary_color?: string;
    secondary_color?: string;
    background_color?: string;
    text_color?: string;
    card_color?: string;
    muted_color?: string;
    accent_color?: string;
    border_color?: string;
  };
  owner_id?: string;
}
