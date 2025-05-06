/**
 * Mock community data for local testing when Supabase connection fails
 */

export const mockCommunities = [
  {
    id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    name: "Test Community",
    description: "A test community for local development",
    logo_url: null,
    banner_url: null,
    domain: null,
    creator_id: "00000000-0000-0000-0000-000000000000",
    created_at: "2023-01-01T00:00:00.000Z",
    updated_at: "2023-01-01T00:00:00.000Z",
    status: "active",
    theme_config: {
      primary_color: "#3b82f6", 
      secondary_color: "#10b981",
      background_color: "#f9fafb"
    },
    api_keys: null,
    is_private: false,
    member_count: 1,
    category: "general",
    slug: "test-community"
  }
]; 