export type Profile = {
  id: string;
  name?: string;
  email?: string;
  avatar_url?: string;
  bio?: string;
  website?: string;
  created_at: string;
  updated_at: string;
  display_name?: string;
  role?: string;
  access_level?: 'free' | 'premium' | 'premium_plus';
}; 