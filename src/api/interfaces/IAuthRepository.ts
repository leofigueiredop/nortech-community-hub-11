import { CommunityContext } from '@/types/community';
import { UserTier } from '@/types/subscription';

export interface Profile {
  id: string;
  user_id?: string;
  full_name: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  profile: Profile;
  isOnboarded?: boolean;
  currentCommunity?: string | null;
  tier?: UserTier;
}

export interface AuthResponse {
  user: AuthUser;
  community: CommunityContext | null;
}

export interface IAuthRepository {
  login(email: string, password: string): Promise<AuthResponse>;
  logout(): Promise<void>;
  getSession(): Promise<AuthResponse>;
  handleAuthCallback(): Promise<AuthResponse>;
  register(email: string, password: string, fullName: string): Promise<AuthResponse>;
  createCommunity(communityData: {
    name: string;
    description: string;
    logo_url?: string | null;
    category?: string;
    is_private?: boolean;
  }): Promise<CommunityContext>;
}
