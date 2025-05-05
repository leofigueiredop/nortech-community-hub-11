import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';
import { supabaseConfig } from '../api/config';

/**
 * Cliente Supabase customizado que automaticamente aplica o filtro de community_id
 * em todas as operações, exceto durante o onboarding.
 * 
 * Seguindo as regras de multi-tenancy do projeto:
 * - Signup via link direto: usuário torna-se member dessa comunidade
 * - Signup genérico: SelectCommunity no fluxo de auth
 * - Signup de Creator: cria nova comunidade e vincula como owner
 */
class EnhancedSupabaseClient extends SupabaseClient<Database> {
  private currentCommunityId: string | null = null;
  private isOnboarding: boolean = false;

  /**
   * Define a comunidade atual para filtrar os dados
   */
  setCurrentCommunity(communityId: string | null) {
    this.currentCommunityId = communityId;
  }

  /**
   * Ativa/desativa o modo onboarding para permitir criar comunidade
   */
  setOnboardingMode(isOnboarding: boolean) {
    this.isOnboarding = isOnboarding;
  }

  /**
   * Sobrescreve o método from para adicionar automaticamente
   * o filtro de community_id em todas as operações
   */
  from<T extends keyof Database['public']['Tables']>(table: T) {
    const query = super.from(table);
    
    // Durante onboarding não aplicamos o filtro de community_id
    if (this.isOnboarding) {
      return query;
    }

    // Se não tiver community_id definido, retorna query vazia
    if (!this.currentCommunityId) {
      console.warn('Tentando acessar dados sem community_id definido');
      return query;
    }

    // Adiciona o filtro de community_id em todas as operações
    const enhancedQuery = query;

    const originalSelect = enhancedQuery.select.bind(enhancedQuery);
    enhancedQuery.select = (...args: any[]) => {
      return originalSelect(...args).eq('community_id', this.currentCommunityId!);
    };

    const originalInsert = enhancedQuery.insert.bind(enhancedQuery);
    enhancedQuery.insert = (data: any, options?: any) => {
      const newData = Array.isArray(data)
        ? data.map(item => ({ ...item, community_id: this.currentCommunityId }))
        : { ...data, community_id: this.currentCommunityId };
      return originalInsert(newData, options);
    };

    const originalUpsert = enhancedQuery.upsert.bind(enhancedQuery);
    enhancedQuery.upsert = (data: any, options?: any) => {
      const newData = Array.isArray(data)
        ? data.map(item => ({ ...item, community_id: this.currentCommunityId }))
        : { ...data, community_id: this.currentCommunityId };
      return originalUpsert(newData, options);
    };

    const originalUpdate = enhancedQuery.update.bind(enhancedQuery);
    enhancedQuery.update = (data: any, options?: any) => {
      return originalUpdate(data, options).eq('community_id', this.currentCommunityId!);
    };

    const originalDelete = enhancedQuery.delete.bind(enhancedQuery);
    enhancedQuery.delete = () => {
      return originalDelete().eq('community_id', this.currentCommunityId!);
    };

    return enhancedQuery;
  }
}

// Criar uma única instância do cliente para interagir com o banco
export const supabase = new EnhancedSupabaseClient(
  supabaseConfig.url,
  supabaseConfig.anonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      storage: window.localStorage,
      storageKey: 'nortech-auth-token',
      debug: import.meta.env.DEV
    }
  }
) as EnhancedSupabaseClient; 