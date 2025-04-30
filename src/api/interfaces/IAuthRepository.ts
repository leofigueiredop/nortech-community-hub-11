import { AuthUser, LoginCredentials, AuthResponse, ApiResponse, SignupType } from '@/types/api';

export interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  loginWithGoogle(): Promise<AuthResponse>;
  loginWithApple(): Promise<AuthResponse>;
  handleAuthCallback(): Promise<AuthResponse>;
  register(credentials: LoginCredentials & { name: string; signupType?: SignupType }): Promise<AuthResponse>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<AuthUser | null>;
  refreshToken(): Promise<AuthResponse>;
  sendEmailVerification(email: string): Promise<void>;
}
