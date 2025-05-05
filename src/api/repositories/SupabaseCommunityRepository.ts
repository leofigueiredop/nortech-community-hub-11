import { SupabaseClient } from '@supabase/supabase-js';
import { ICommunityRepository, Community } from '../interfaces/ICommunityRepository';
import { Result } from '@/types/api';

export class SupabaseCommunityRepository implements ICommunityRepository {
  private readonly client: SupabaseClient;

  constructor(client: SupabaseClient) {
    this.client = client;
  }

  async searchCommunities(query: string, filters?: { 
    isPrivate?: boolean;
    status?: string;
    category?: string;
  }): Promise<Result<Community[]>> {
    try {
      let queryBuilder = this.client
        .from('communities')
        .select(`
          *,
          profiles!communities_creator_id_fkey (
            full_name
          )
        `)
        .textSearch('name', query);

      if (filters?.isPrivate !== undefined) {
        queryBuilder = queryBuilder.eq('is_private', filters.isPrivate);
      }
      if (filters?.status) {
        queryBuilder = queryBuilder.eq('status', filters.status);
      }
      if (filters?.category) {
        queryBuilder = queryBuilder.eq('category', filters.category);
      }

      const { data, error } = await queryBuilder;

      if (error) throw error;

      const communities = data.map(community => ({
        id: community.id,
        name: community.name,
        description: community.description,
        slug: community.slug,
        isPrivate: community.is_private,
        status: community.status,
        category: community.category,
        creatorId: community.creator_id,
        creatorName: community.profiles?.full_name || 'Unknown',
        logo_url: community.logo_url,
        banner_url: community.banner_url,
        memberCount: community.member_count,
        createdAt: new Date(community.created_at),
        updatedAt: new Date(community.updated_at)
      }));

      return { ok: true, data: communities };
    } catch (error) {
      console.error('Error searching communities:', error);
      return { ok: false, error: { message: 'Failed to search communities' } };
    }
  }

  async getFeaturedCommunities(): Promise<Result<Community[]>> {
    try {
      const { data, error } = await this.client
        .from('communities')
        .select(`
          *,
          profiles!communities_creator_id_fkey (
            full_name
          )
        `)
        .eq('status', 'active')
        .order('member_count', { ascending: false })
        .limit(6);

      if (error) throw error;

      const communities = data.map(community => ({
        id: community.id,
        name: community.name,
        description: community.description,
        slug: community.slug,
        isPrivate: community.is_private,
        status: community.status,
        category: community.category,
        creatorId: community.creator_id,
        creatorName: community.profiles?.full_name || 'Unknown',
        logo_url: community.logo_url,
        banner_url: community.banner_url,
        memberCount: community.member_count,
        createdAt: new Date(community.created_at),
        updatedAt: new Date(community.updated_at)
      }));

      return { ok: true, data: communities };
    } catch (error) {
      console.error('Error getting featured communities:', error);
      return { ok: false, error: { message: 'Failed to get featured communities' } };
    }
  }

  async getCommunityById(id: string): Promise<Result<Community>> {
    try {
      const { data, error } = await this.client
        .from('communities')
        .select(`
          *,
          profiles!communities_creator_id_fkey (
            full_name
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Community not found');

      const community: Community = {
        id: data.id,
        name: data.name,
        description: data.description,
        slug: data.slug,
        isPrivate: data.is_private,
        status: data.status,
        category: data.category,
        creatorId: data.creator_id,
        creatorName: data.profiles?.full_name || 'Unknown',
        logo_url: data.logo_url,
        banner_url: data.banner_url,
        memberCount: data.member_count,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };

      return { ok: true, data: community };
    } catch (error) {
      console.error('Error getting community by ID:', error);
      return { ok: false, error: { message: 'Failed to get community' } };
    }
  }

  async getCommunityBySlug(slug: string): Promise<Result<Community>> {
    try {
      const { data, error } = await this.client
        .from('communities')
        .select(`
          *,
          profiles!communities_creator_id_fkey (
            full_name
          )
        `)
        .eq('slug', slug)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Community not found');

      const community: Community = {
        id: data.id,
        name: data.name,
        description: data.description,
        slug: data.slug,
        isPrivate: data.is_private,
        status: data.status,
        category: data.category,
        creatorId: data.creator_id,
        creatorName: data.profiles?.full_name || 'Unknown',
        logo_url: data.logo_url,
        banner_url: data.banner_url,
        memberCount: data.member_count,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };

      return { ok: true, data: community };
    } catch (error) {
      console.error('Error getting community by slug:', error);
      return { ok: false, error: { message: 'Failed to get community' } };
    }
  }

  async createCommunity(data: Partial<Community>): Promise<Result<Community>> {
    try {
      console.log("Creating community with data:", data);
      
      const { data: community, error } = await this.client
        .from('communities')
        .insert([{
          name: data.name,
          description: data.description,
          slug: data.slug,
          is_private: data.is_private,
          status: data.status || 'active',
          category: data.category,
          creator_id: data.creator_id,
          logo_url: data.logo_url,
          banner_url: data.banner_url,
          member_count: data.member_count || 0,
          domain: data.domain,
          theme_config: data.theme_config,
          api_keys: data.api_keys
        }])
        .select('*')
        .single();

      if (error) {
        console.error('Error creating community:', error);
        throw error;
      }
      if (!community) throw new Error('Failed to create community');

      return {
        ok: true,
        data: {
          id: community.id,
          name: community.name,
          description: community.description,
          slug: community.slug,
          is_private: community.is_private,
          status: community.status,
          category: community.category,
          creator_id: community.creator_id,
          domain: community.domain,
          logo_url: community.logo_url,
          banner_url: community.banner_url,
          theme_config: community.theme_config,
          api_keys: community.api_keys,
          member_count: community.member_count,
          createdAt: new Date(community.created_at),
          updatedAt: new Date(community.updated_at)
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
      const { data: community, error } = await this.client
        .from('communities')
        .update({
          name: data.name,
          description: data.description,
          slug: data.slug,
          is_private: data.isPrivate,
          status: data.status,
          category: data.category,
          logo_url: data.logo_url,
          banner_url: data.banner_url
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
          slug: community.slug,
          isPrivate: community.is_private,
          status: community.status,
          category: community.category,
          creatorId: community.creator_id,
          creatorName: 'Unknown',
          logo_url: community.logo_url,
          banner_url: community.banner_url,
          memberCount: community.member_count,
          createdAt: new Date(community.created_at),
          updatedAt: new Date(community.updated_at)
        }
      };
    } catch (error) {
      console.error('Error updating community:', error);
      return { ok: false, error: { message: 'Failed to update community' } };
    }
  }

  async deleteCommunity(id: string): Promise<Result<void>> {
    try {
      const { error } = await this.client
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
      const { error } = await this.client
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
      const { error } = await this.client
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
      const { data, error } = await this.client
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
      const { data, error } = await this.client
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
}
