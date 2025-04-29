// API Response types
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

// Base Repository interface
export interface BaseRepository {
  handleResponse<T>(response: ApiResponse<T>): Promise<T>;
}

// Auth types
export type AuthUser = {
  id: string;
  email: string;
  name: string;
  accessLevel?: 'free' | 'pro' | 'admin';
  interests?: string[];
  isOnboarded?: boolean;
};

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: AuthUser;
  session: {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  };
}
