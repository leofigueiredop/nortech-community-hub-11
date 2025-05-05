// Add UUID type at the top
type UUID = string; // Type alias for UUID strings

// API Response types
export interface ApiResponse<T = any> {
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}

// Base Repository interface
export interface BaseRepository {
  handleResponse<T>(response: ApiResponse<T>): Promise<T>;
}

// Auth types
export interface Result<T> {
  ok: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}

export interface AuthUser {
  id: UUID;
  email: string;
  name: string;
  role: string;
  accessLevel: 'free' | 'premium' | 'creator';
  interests: string[];
  isOnboarded: boolean;
  communityId?: UUID;
  communityRole?: 'admin' | 'moderator' | 'member';
}

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

export interface AuthResponse {
  user: AuthUser;
  session: AuthSession | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role?: string;
}

export type SignupType = 'member' | 'community_creator' | 'content_creator';
