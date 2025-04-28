
export interface Community {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  banner_url?: string;
  primary_color?: string;
  secondary_color?: string;
  is_public: boolean;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export const mockCommunities: Community[] = [
  {
    id: "comm-1",
    name: "Nortech",
    slug: "nortech",
    description: "A technology learning community",
    logo_url: "https://via.placeholder.com/150",
    banner_url: "https://via.placeholder.com/1200x300",
    primary_color: "#6E56CF",
    secondary_color: "#4A36A0",
    is_public: true,
    owner_id: "user-1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];
