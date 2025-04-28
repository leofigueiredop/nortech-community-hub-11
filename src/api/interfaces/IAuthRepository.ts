
import { AuthUser, LoginCredentials, AuthResponse, ApiResponse } from '@/types/api';

export interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  register(credentials: LoginCredentials & { name: string }): Promise<AuthResponse>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<AuthUser | null>;
  refreshToken(): Promise<AuthResponse>;
}
