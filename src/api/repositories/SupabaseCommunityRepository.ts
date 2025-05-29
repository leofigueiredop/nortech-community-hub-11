import { SupabaseClient } from '@supabase/supabase-js';
import { ICommunityRepository, Community } from '@/api/interfaces/ICommunityRepository';
import { Result } from '@/types/api';
import { IBaseRepository } from '@/api/interfaces/IBaseRepository';

export class SupabaseCommunityRepository implements ICommunityRepository, IBaseRepository {
  private currentCommunityId: string | null = null;

  constructor(private supabase: SupabaseClient) {}

  setCommunityContext(communityId: string | null): void {
    this.currentCommunityId = communityId;
  }

  async searchCommunities(
    query: string,
    filters?: { 
      is_private?: boolean;
      status?: string;
      category?: string;
    }
  ): Promise<Result<Community[]>> {
    try {
      console.log('Searching communities with:', { query, filters });
      
      let queryBuilder = this.supabase
        .from('communities')
        .select('*');

      // Apply filters if provided
      if (filters?.status) {
        queryBuilder = queryBuilder.eq('status', filters.status);
      }

      if (filters?.is_private !== undefined) {
        queryBuilder = queryBuilder.eq('is_private', filters.is_private);
      }

      if (filters?.category) {
        queryBuilder = queryBuilder.eq('category', filters.category);
      }

      if (query) {
        queryBuilder = queryBuilder.ilike('name', `%${query}%`);
      }

      const { data, error } = await queryBuilder;

      if (error) throw error;

      return { 
        ok: true, 
        data: data?.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description,
          logo_url: item.logo_url,
          banner_url: item.banner_url,
          domain: item.domain,
          creator_id: item.creator_id,
          created_at: item.created_at,
          updated_at: item.updated_at,
          status: item.status,
          theme_config: item.theme_config || {},
          api_keys: item.api_keys || {},
          is_private: item.is_private,
          member_count: item.member_count,
          category: item.category,
          slug: item.slug
        })) as Community[] 
      };
    } catch (error) {
      console.error('Error searching communities:', error);
      return { ok: false, error: error as Error };
    }
  }

  async getFeaturedCommunities(): Promise<Result<Community[]>> {
    try {
      const { data, error } = await this.supabase
        .from('communities')
        .select('*')
        .eq('status', 'active')
        .order('member_count', { ascending: false })
        .limit(6);

      if (error) throw error;

      return { 
        ok: true, 
        data: data.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description,
          logo_url: item.logo_url,
          banner_url: item.banner_url,
          domain: item.domain,
          creator_id: item.creator_id,
          created_at: item.created_at,
          updated_at: item.updated_at,
          status: item.status,
          theme_config: item.theme_config || {},
          api_keys: item.api_keys || {},
          is_private: item.is_private,
          member_count: item.member_count,
          category: item.category,
          slug: item.slug
        }))
      };
    } catch (error) {
      console.error('Error getting featured communities:', error);
      return { ok: false, error: { message: 'Failed to get featured communities' } };
    }
  }

  async getCommunityById(id: string): Promise<Result<Community>> {
    try {
      const { data, error } = await this.supabase
        .from('communities')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Community not found');

      return { 
        ok: true, 
        data: {
          id: data.id,
          name: data.name,
          description: data.description,
          logo_url: data.logo_url,
          banner_url: data.banner_url,
          domain: data.domain,
          creator_id: data.creator_id,
          created_at: data.created_at,
          updated_at: data.updated_at,
          status: data.status,
          theme_config: data.theme_config || {},
          api_keys: data.api_keys || {},
          is_private: data.is_private,
          member_count: data.member_count,
          category: data.category,
          slug: data.slug
        }
      };
    } catch (error) {
      console.error('Error getting community by ID:', error);
      return { ok: false, error: { message: 'Failed to get community' } };
    }
  }

  async getCommunityBySlug(slug: string): Promise<Result<Community>> {
    try {
      const { data, error } = await this.supabase
        .from('communities')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Community not found');

      return { 
        ok: true, 
        data: {
          id: data.id,
          name: data.name,
          description: data.description,
          logo_url: data.logo_url,
          banner_url: data.banner_url,
          domain: data.domain,
          creator_id: data.creator_id,
          created_at: data.created_at,
          updated_at: data.updated_at,
          status: data.status,
          theme_config: data.theme_config || {},
          api_keys: data.api_keys || {},
          is_private: data.is_private,
          member_count: data.member_count,
          category: data.category,
          slug: data.slug
        }
      };
    } catch (error) {
      console.error('Error getting community by slug:', error);
      return { ok: false, error: { message: 'Failed to get community' } };
    }
  }

  async createCommunity(data: Partial<Community>): Promise<Result<Community>> {
    try {
      const { data: community, error } = await this.supabase
        .from('communities')
        .insert([{
          name: data.name,
          description: data.description,
          logo_url: data.logo_url,
          banner_url: data.banner_url,
          domain: data.domain,
          creator_id: data.creator_id,
          status: data.status || 'active',
          theme_config: data.theme_config || {},
          api_keys: data.api_keys || {},
          is_private: data.is_private || false,
          member_count: data.member_count || 0,
          category: data.category || 'general',
          slug: data.slug
        }])
        .select('*')
        .single();

      if (error) throw error;
      if (!community) throw new Error('Failed to create community');

      return {
        ok: true,
        data: {
          id: community.id,
          name: community.name,
          description: community.description,
          logo_url: community.logo_url,
          banner_url: community.banner_url,
          domain: community.domain,
          creator_id: community.creator_id,
          created_at: community.created_at,
          updated_at: community.updated_at,
          status: community.status,
          theme_config: community.theme_config || {},
          api_keys: community.api_keys || {},
          is_private: community.is_private,
          member_count: community.member_count,
          category: community.category,
          slug: community.slug
        }
      };
    } catch (error) {
      console.error('Error creating community:', error);
      return { 
        ok: false, 
        error: error instanceof Error 
          ? { message: error.message } 
          : { message: 'Failed to create community' }
      };
    }
  }

  async updateCommunity(id: string, data: Partial<Community>): Promise<Result<Community>> {
    try {
      const { data: community, error } = await this.supabase
        .from('communities')
        .update({
          name: data.name,
          description: data.description,
          logo_url: data.logo_url,
          banner_url: data.banner_url,
          domain: data.domain,
          status: data.status,
          theme_config: data.theme_config,
          api_keys: data.api_keys,
          is_private: data.is_private,
          category: data.category,
          slug: data.slug
        })
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;
      if (!community) throw new Error('Community not found');

      return {
        ok: true,
        data: {
          id: community.id,
          name: community.name,
          description: community.description,
          logo_url: community.logo_url,
          banner_url: community.banner_url,
          domain: community.domain,
          creator_id: community.creator_id,
          created_at: community.created_at,
          updated_at: community.updated_at,
          status: community.status,
          theme_config: community.theme_config || {},
          api_keys: community.api_keys || {},
          is_private: community.is_private,
          member_count: community.member_count,
          category: community.category,
          slug: community.slug
        }
      };
    } catch (error) {
      console.error('Error updating community:', error);
      return { ok: false, error: { message: 'Failed to update community' } };
    }
  }

  async deleteCommunity(id: string): Promise<Result<void>> {
    try {
      const { error } = await this.supabase
        .from('communities')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { ok: true, data: undefined };
    } catch (error) {
      console.error('Error deleting community:', error);
      return { ok: false, error: { message: 'Failed to delete community' } };
    }
  }

  async joinCommunity(communityId: string, userId: string): Promise<Result<void>> {
    try {
      const { error } = await this.supabase
        .from('community_members')
        .insert({
          community_id: communityId,
          user_id: userId,
          role: 'member',
          joined_at: new Date().toISOString()
        });

      if (error) throw error;

      return { ok: true, data: undefined };
    } catch (error) {
      console.error('Error joining community:', error);
      return { ok: false, error: { message: 'Failed to join community' } };
    }
  }

  async leaveCommunity(communityId: string, userId: string): Promise<Result<void>> {
    try {
      const { error } = await this.supabase
        .from('community_members')
        .delete()
        .eq('community_id', communityId)
        .eq('user_id', userId);

      if (error) throw error;

      return { ok: true, data: undefined };
    } catch (error) {
      console.error('Error leaving community:', error);
      return { ok: false, error: { message: 'Failed to leave community' } };
    }
  }

  async getAllMembers(communityId: string): Promise<Result<string[]>> {
    try {
      const { data, error } = await this.supabase
        .from('community_members')
        .select('user_id')
        .eq('community_id', communityId);

      if (error) throw error;

      return { ok: true, data: data.map(member => member.user_id) };
    } catch (error) {
      console.error('Error getting community members:', error);
      return { ok: false, error: { message: 'Failed to get community members' } };
    }
  }

  async isMember(communityId: string, userId: string): Promise<Result<boolean>> {
    try {
      const { data, error } = await this.supabase
        .from('community_members')
        .select('user_id')
        .eq('community_id', communityId)
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;

      return { ok: true, data: !!data };
    } catch (error) {
      console.error('Error checking community membership:', error);
      return { ok: false, error: { message: 'Failed to check community membership' } };
    }
  }

  async getActiveSpaces(communityId: string): Promise<Result<number>> {
    try {
      // Espaços atualizados nos últimos 7 dias
      const since = new Date();
      since.setDate(since.getDate() - 7);

      const { count, error } = await this.supabase
        .from('spaces')
        .select('id', { count: 'exact', head: true })
        .eq('community_id', communityId)
        .gte('updated_at', since.toISOString());

      if (error) throw error;
      return { ok: true, data: count ?? 0 };
    } catch (error) {
      return { ok: false, error };
    }
  }

  async getPostsThisWeek(communityId: string): Promise<Result<number>> {
    try {
      const since = new Date();
      since.setDate(since.getDate() - 7);
    
      const { count, error } = await this.supabase
        .from('posts') // troque para o nome real da tabela de posts, se for diferente
        .select('id', { count: 'exact', head: true })
        .eq('community_id', communityId)
        .gte('created_at', since.toISOString());
    
      if (error) throw error;
      return { ok: true, data: count ?? 0 };
    } catch (error) {
      return { ok: false, error };
    }
  }

  async getUpcomingEvents(communityId: string): Promise<Result<any[]>> {
    try {
      const today = new Date().toISOString();
      const { data, error } = await this.supabase
        .from('events')
        .select('*')
        .eq('community_id', communityId)
        .gte('start_date', today)
        .order('start_date', { ascending: true });

      if (error) throw error;
      return { ok: true, data: data ?? [] };
    } catch (error) {
      return { ok: false, error };
    } 
  }
}
