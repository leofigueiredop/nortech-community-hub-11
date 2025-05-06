import { CommunityContext } from '@/types/community';

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
}

export interface AuthResponse {
  user: AuthUser;
  community: CommunityContext;
}

export interface IAuthRepository {
  login(email: string, password: string): Promise<AuthResponse>;
  logout(): Promise<void>;
  getSession(): Promise<AuthResponse>;
  handleAuthCallback(): Promise<AuthResponse>;
}
