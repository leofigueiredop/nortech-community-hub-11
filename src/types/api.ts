
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
export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role?: string;
}

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
