
import { createClient } from '@supabase/supabase-js';
import { IAuthRepository } from '../interfaces/IAuthRepository';
import { AuthUser, LoginCredentials, AuthResponse } from '@/types/api';
import { BaseRepository } from './BaseRepository';

export class SupabaseAuthRepository extends BaseRepository implements IAuthRepository {
  private supabase;

  constructor() {
    super();
    this.supabase = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    );
  }

  async login({ email, password }: LoginCredentials): Promise<AuthResponse> {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return {
        user: {
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata?.name,
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

  async register({ email, password, name }: LoginCredentials & { name: string }): Promise<AuthResponse> {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) throw error;

      return {
        user: {
          id: data.user!.id,
          email: data.user!.email!,
          name: data.user!.user_metadata?.name,
        },
        session: {
          access_token: data.session!.access_token,
          refresh_token: data.session!.refresh_token,
          expires_at: data.session!.expires_at,
        },
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      const { error } = await this.supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user }, error } = await this.supabase.auth.getUser();
      
      if (error) throw error;
      if (!user) return null;

      return {
        id: user.id,
        email: user.email!,
        name: user.user_metadata?.name,
      };
    } catch (error) {
      return this.handleError(error);
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
}
