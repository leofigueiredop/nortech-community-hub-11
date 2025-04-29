import { SupabaseClient } from '@supabase/supabase-js';
import { IAuthRepository } from '../interfaces/IAuthRepository';
import { AuthUser, LoginCredentials, AuthResponse } from '@/types/api';
import { BaseRepository } from './BaseRepository';

export class SupabaseAuthRepository extends BaseRepository implements IAuthRepository {
  constructor(supabaseClient: SupabaseClient) {
    super(supabaseClient);
  }

  async login({ email, password }: LoginCredentials): Promise<AuthResponse> {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        throw new Error(error.message || 'Erro no login');
      }

      if (!data.user) {
        throw new Error('Usuário não autenticado');
      }

      return {
        user: {
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata?.name || email.split('@')[0],
        },
        session: data.session ? {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at,
        } : null
      };
    } catch (error) {
      console.error('Login completo error:', error);
      
      if (error instanceof Error) {
        throw new Error(`Falha no login: ${error.message}`);
      }
      
      throw new Error('Erro desconhecido durante o login');
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
            display_name: name,
            role: 'member'
          }
        }
      });

      if (error) {
        console.error('Signup error:', error);
        throw new Error(error.message || 'Erro no registro');
      }

      if (!data.user) {
        throw new Error('Usuário não criado');
      }

      const session = data.session;
      
      return {
        user: {
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata?.name || name,
        },
        session: session ? {
          access_token: session.access_token,
          refresh_token: session.refresh_token,
          expires_at: session.expires_at,
        } : null
      };
    } catch (error) {
      console.error('Registro completo error:', error);
      
      if (error instanceof Error) {
        throw new Error(`Falha no registro: ${error.message}`);
      }
      
      throw new Error('Erro desconhecido durante o registro');
    }
  }

  async logout(): Promise<void> {
    try {
      const { error } = await this.supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        throw new Error(error.message || 'Erro no logout');
      }
    } catch (error) {
      console.error('Logout completo error:', error);
      throw new Error('Não foi possível fazer logout');
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      // Primeiro tenta recuperar a sessão
      const { data: sessionData } = await this.supabase.auth.getSession();
      
      // Se não há sessão, retorna null
      if (!sessionData.session) {
        console.warn('No active session found');
        return null;
      }

      // Com a sessão ativa, busca os dados do usuário
      const { data: { user }, error } = await this.supabase.auth.getUser();
      
      if (error) {
        console.error('Get current user error:', error);
        return null;
      }

      if (!user) {
        console.warn('No user data found');
        return null;
      }

      return {
        id: user.id,
        email: user.email!,
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'Usuário',
        accessLevel: user.user_metadata?.accessLevel || 'free',
        interests: user.user_metadata?.interests || [],
        isOnboarded: user.user_metadata?.isOnboarded || false
      };
    } catch (error) {
      console.error('Erro ao buscar usuário atual:', error);
      return null;
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

  async sendEmailVerification(email: string): Promise<void> {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/verify-email`
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Erro no envio de verificação de email:', error);
      throw new Error('Não foi possível enviar o email de verificação');
    }
  }
}
