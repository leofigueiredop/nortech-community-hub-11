import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { IAuthRepository } from '../interfaces/IAuthRepository';
import { AuthResponse, AuthUser, LoginCredentials, SignupType, AuthSession } from '@/types/api';
import { supabaseConfig } from '../config';
import { BaseRepository } from './BaseRepository';

export class SupabaseAuthRepository extends BaseRepository implements IAuthRepository {
  constructor() {
    const client = createClient(supabaseConfig.url, supabaseConfig.anonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    });
    super(client);
  }

  async register(credentials: LoginCredentials & { 
    name: string;
    signupType?: SignupType;
    communityId?: string;
  }): Promise<AuthResponse> {
    const { email, password, name, signupType = 'member', communityId } = credentials;
    
    try {
      const { data: authData, error: signUpError } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: signupType === 'community_creator' ? 'admin' : (signupType === 'content_creator' ? 'creator' : 'user'),
            accessLevel: signupType === 'community_creator' ? 'creator' : (signupType === 'content_creator' ? 'creator' : 'free'),
            interests: [],
            isOnboarded: false,
            communityId: communityId || null,
            communityRole: signupType === 'community_creator' ? 'admin' : (communityId ? 'member' : null)
          }
        }
      });

      if (signUpError) {
        console.error('Registration error:', signUpError);
        throw signUpError;
      }

      if (!authData.user) {
        throw new Error('Registration failed - no user data returned');
      }

      const user: AuthUser = {
        id: authData.user.id,
        email: authData.user.email!,
        name: authData.user.user_metadata.name,
        role: authData.user.user_metadata.role,
        accessLevel: authData.user.user_metadata.accessLevel,
        interests: authData.user.user_metadata.interests,
        isOnboarded: authData.user.user_metadata.isOnboarded,
        communityId: authData.user.user_metadata.communityId,
        communityRole: authData.user.user_metadata.communityRole
      };

      return {
        user,
        session: authData.session as AuthSession
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { email, password } = credentials;

    try {
      const { data: authData, error: signInError } = await this.supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        console.error('Login error:', signInError);
        throw signInError;
      }

      if (!authData.user) {
        throw new Error('Login failed - no user data returned');
      }

      const user: AuthUser = {
        id: authData.user.id,
        email: authData.user.email!,
        name: authData.user.user_metadata.name,
        role: authData.user.user_metadata.role,
        accessLevel: authData.user.user_metadata.accessLevel,
        interests: authData.user.user_metadata.interests,
        isOnboarded: authData.user.user_metadata.isOnboarded,
        communityId: authData.user.user_metadata.communityId,
        communityRole: authData.user.user_metadata.communityRole
      };

      return {
        user,
        session: authData.session as AuthSession
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async loginWithGoogle(): Promise<AuthResponse> {
    try {
      const { data, error } = await this.supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('Google login error:', error);
        throw new Error(error.message || 'Erro no login com Google');
      }

      // O Supabase redirecionará o usuário para a página de callback
      // onde você deve chamar handleAuthCallback
      return null;
    } catch (error) {
      console.error('Google login error:', error);
      throw new Error('Erro ao fazer login com Google');
    }
  }

  async loginWithApple(): Promise<AuthResponse> {
    try {
      const { data, error } = await this.supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: 'name email',
        },
      });

      if (error) {
        console.error('Apple login error:', error);
        throw new Error(error.message || 'Erro no login com Apple');
      }

      // O Supabase redirecionará o usuário para a página de callback
      // onde você deve chamar handleAuthCallback
      return null;
    } catch (error) {
      console.error('Apple login error:', error);
      throw new Error('Erro ao fazer login com Apple');
    }
  }

  async handleAuthCallback(): Promise<AuthResponse> {
    try {
      const { data: { session }, error } = await this.supabase.auth.getSession();

      if (error) throw error;
      if (!session) throw new Error('No session found');

      const { data: { user }, error: userError } = await this.supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('No user found');

      return {
        user: {
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'Usuário',
          role: user.user_metadata?.role || 'member',
          accessLevel: user.user_metadata?.accessLevel || 'free',
          interests: user.user_metadata?.interests || [],
          isOnboarded: user.user_metadata?.isOnboarded || false,
          communityId: user.user_metadata?.communityId,
          communityRole: user.user_metadata?.communityRole
        },
        session: {
          access_token: session.access_token,
          refresh_token: session.refresh_token,
          expires_at: session.expires_at,
        },
      };
    } catch (error) {
      console.error('Auth callback error:', error);
      throw new Error('Erro ao processar autenticação');
    }
  }

  async logout(): Promise<void> {
    try {
      const { error } = await this.supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user }, error } = await this.supabase.auth.getUser();

      if (error) {
        console.error('Get current user error:', error);
        throw error;
      }

      if (!user) {
        return null;
      }

      return {
        id: user.id,
        email: user.email!,
        name: user.user_metadata.name,
        role: user.user_metadata.role || 'user',
        accessLevel: user.user_metadata.accessLevel || 'free',
        interests: user.user_metadata.interests || [],
        isOnboarded: user.user_metadata.isOnboarded || false,
        communityId: user.user_metadata.communityId || null,
        communityRole: user.user_metadata.communityRole || null
      };
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    try {
      const { data, error } = await this.supabase.auth.refreshSession();
      
      if (error) throw error;
      if (!data.session) throw new Error('No session found');

      return {
        user: {
          id: data.user!.id,
          email: data.user!.email!,
          name: data.user!.user_metadata?.name,
          role: data.user!.user_metadata?.role || 'member',
          accessLevel: data.user!.user_metadata?.accessLevel || 'free',
          interests: data.user!.user_metadata?.interests || [],
          isOnboarded: data.user!.user_metadata?.isOnboarded || false,
          communityId: data.user!.user_metadata?.communityId,
          communityRole: data.user!.user_metadata?.communityRole
        },
        session: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at,
        },
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async sendEmailVerification(email: string): Promise<void> {
    try {
      const { error } = await this.supabase.auth.resend({
        type: 'signup',
        email
      });

      if (error) {
        console.error('Email verification error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  }

  protected handleError(error: any): never {
    console.error('Auth repository error:', error);
    throw error;
  }
}
