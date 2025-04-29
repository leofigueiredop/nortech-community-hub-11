
import { createClient } from '@supabase/supabase-js';
import { ICommunityRepository, Community } from '../interfaces/ICommunityRepository';
import { BaseRepository } from './BaseRepository';
import { supabaseConfig } from '../config';

export interface CommunitySettings {
  id: string;
  community_id: string;
  settings_type: string;
  settings_data: any;
  created_at: string;
  updated_at: string;
}

export interface CommunityMember {
  id: string;
  user_id: string;
  community_id: string;
  role: string;
  joined_at: string;
  status: string;
  permissions?: string[];
}

export class SupabaseCommunityRepository extends BaseRepository implements ICommunityRepository {
  constructor() {
    super();
  }

  async getCommunityById(id: string): Promise<Community> {
    try {
      const { data, error } = await this.supabase
        .from('communities')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Community;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getCommunityByDomain(domain: string): Promise<Community | null> {
    try {
      const { data, error } = await this.supabase
        .from('communities')
        .select('*')
        .eq('domain', domain)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
      return data as Community || null;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async createCommunity(community: Partial<Community>): Promise<Community> {
    try {
      const { data, error } = await this.supabase
        .from('communities')
        .insert([community])
        .select()
        .single();
      
      if (error) throw error;
      return data as Community;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateCommunity(id: string, community: Partial<Community>): Promise<Community> {
    try {
      await this.setTenantContext();
      const { data, error } = await this.supabase
        .from('communities')
        .update(community)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as Community;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getSettings(type: string): Promise<CommunitySettings> {
    try {
      await this.setTenantContext();
      const { data, error } = await this.supabase
        .from('community_settings')
        .select('*')
        .eq('community_id', this.currentCommunityId)
        .eq('settings_type', type)
        .single();
      
      if (error) throw error;
      return data as CommunitySettings;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateSettings(type: string, settings: any): Promise<CommunitySettings> {
    try {
      await this.setTenantContext();
      // Check if settings exist
      const { data: existingData } = await this.supabase
        .from('community_settings')
        .select('id')
        .eq('community_id', this.currentCommunityId)
        .eq('settings_type', type)
        .single();
      
      let result;
      if (existingData) {
        // Update existing settings
        const { data, error } = await this.supabase
          .from('community_settings')
          .update({ settings_data: settings })
          .eq('id', existingData.id)
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      } else {
        // Create new settings
        const { data, error } = await this.supabase
          .from('community_settings')
          .insert([{
            community_id: this.currentCommunityId,
            settings_type: type,
            settings_data: settings
          }])
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      }
      
      return result as CommunitySettings;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getMemberById(userId: string): Promise<CommunityMember | null> {
    try {
      await this.setTenantContext();
      const { data, error } = await this.supabase
        .from('community_members')
        .select('*')
        .eq('community_id', this.currentCommunityId)
        .eq('user_id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data as CommunityMember || null;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async addMember(member: Partial<CommunityMember>): Promise<CommunityMember> {
    try {
      await this.setTenantContext();
      const { data, error } = await this.supabase
        .from('community_members')
        .insert([{
          community_id: this.currentCommunityId,
          ...member
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data as CommunityMember;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateMember(userId: string, member: Partial<CommunityMember>): Promise<CommunityMember> {
    try {
      await this.setTenantContext();
      const { data, error } = await this.supabase
        .from('community_members')
        .update(member)
        .eq('community_id', this.currentCommunityId)
        .eq('user_id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return data as CommunityMember;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async removeMember(userId: string): Promise<void> {
    try {
      await this.setTenantContext();
      const { error } = await this.supabase
        .from('community_members')
        .delete()
        .eq('community_id', this.currentCommunityId)
        .eq('user_id', userId);
      
      if (error) throw error;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getAllMembers(page: number = 1, limit: number = 20): Promise<{ members: CommunityMember[], total: number }> {
    try {
      await this.setTenantContext();
      
      // Get total count
      const { count, error: countError } = await this.supabase
        .from('community_members')
        .select('*', { count: 'exact', head: true })
        .eq('community_id', this.currentCommunityId);
      
      if (countError) throw countError;
      
      // Get members with pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      
      const { data, error } = await this.supabase
        .from('community_members')
        .select('*')
        .eq('community_id', this.currentCommunityId)
        .range(from, to);
      
      if (error) throw error;
      
      return {
        members: data as CommunityMember[],
        total: count || 0
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
}
