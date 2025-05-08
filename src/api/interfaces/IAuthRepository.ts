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
  profile: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
  role?: 'owner' | 'admin' | 'moderator' | 'member';
  communityRole?: 'owner' | 'admin' | 'moderator' | 'member';
  moderatorPermissions?: {
    can_delete_content: boolean;
    can_ban_users: boolean;
    can_edit_user_content: boolean;
    can_approve_flagged_content: boolean;
  };
}

export interface AuthResponse {
  user: AuthUser;
  community?: CommunityContext;
  role?: 'owner' | 'admin' | 'moderator' | 'member';
}

export interface IAuthRepository {
  login(email: string, password: string): Promise<AuthResponse>;
  logout(): Promise<void>;
  getSession(): Promise<AuthResponse>;
  handleAuthCallback(): Promise<AuthResponse>;
}
