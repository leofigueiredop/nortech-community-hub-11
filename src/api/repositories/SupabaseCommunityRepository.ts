
import { createClient } from '@supabase/supabase-js';
import { ICommunityRepository, Community, CommunityMember, CommunitySettings, SubscriptionPlan } from '../interfaces/ICommunityRepository';
import { BaseRepository } from './BaseRepository';
import { supabaseConfig } from '../ApiClient';
import { v4 as uuidv4 } from 'uuid';

export class SupabaseCommunityRepository extends BaseRepository implements ICommunityRepository {
  private supabase;

  constructor() {
    super();
    this.supabase = createClient(
      supabaseConfig.url,
      supabaseConfig.anonKey
    );
  }

  // Set tenant context for all operations
  private async setTenantContext(communityId: string): Promise<void> {
    try {
      await this.supabase.rpc('set_tenant_context', { community_uuid: communityId });
    } catch (error) {
      console.error('Error setting tenant context:', error);
    }
  }

  // Community management
  async getCommunity(id: string): Promise<Community> {
    try {
      const { data, error } = await this.supabase
        .from('communities')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async createCommunity(community: Partial<Community>): Promise<Community> {
    try {
      const newCommunity = {
        id: uuidv4(),
        ...community,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: community.status || 'active',
      };

      const { data, error } = await this.supabase
        .from('communities')
        .insert([newCommunity])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateCommunity(id: string, community: Partial<Community>): Promise<Community> {
    try {
      const updates = {
        ...community,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await this.supabase
        .from('communities')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deleteCommunity(id: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('communities')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getCommunityByDomain(domain: string): Promise<Community | null> {
    try {
      const { data, error } = await this.supabase
        .from('communities')
        .select('*')
        .eq('domain', domain)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') return null; // No rows found
        throw error;
      }
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getUserCommunities(userId: string): Promise<Community[]> {
    try {
      // First get communities where user is a member
      const { data: memberships, error: membershipError } = await this.supabase
        .from('community_members')
        .select('community_id')
        .eq('user_id', userId);
      
      if (membershipError) throw membershipError;
      
      if (!memberships || memberships.length === 0) return [];
      
      const communityIds = memberships.map(m => m.community_id);
      
      // Then get the actual communities
      const { data, error } = await this.supabase
        .from('communities')
        .select('*')
        .in('id', communityIds);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      return this.handleError(error);
    }
  }
  
  // Community settings
  async getSettings(communityId: string, settingsType: string): Promise<CommunitySettings> {
    try {
      await this.setTenantContext(communityId);
      
      const { data, error } = await this.supabase
        .from('community_settings')
        .select('*')
        .eq('community_id', communityId)
        .eq('settings_type', settingsType)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') { // No rows found
          return {
            community_id: communityId,
            settings_type: settingsType,
            settings_data: {}
          };
        }
        throw error;
      }
      
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateSettings(communityId: string, settingsType: string, settings: Record<string, any>): Promise<CommunitySettings> {
    try {
      await this.setTenantContext(communityId);
      
      // Check if settings already exist
      const { data: existingData, error: fetchError } = await this.supabase
        .from('community_settings')
        .select('id')
        .eq('community_id', communityId)
        .eq('settings_type', settingsType)
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;
      
      if (existingData) {
        // Update existing settings
        const { data, error } = await this.supabase
          .from('community_settings')
          .update({
            settings_data: settings,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingData.id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } else {
        // Create new settings
        const newSettings = {
          id: uuidv4(),
          community_id: communityId,
          settings_type: settingsType,
          settings_data: settings,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        const { data, error } = await this.supabase
          .from('community_settings')
          .insert([newSettings])
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    } catch (error) {
      return this.handleError(error);
    }
  }
  
  // Community members
  async getMembers(communityId: string, params?: { role?: string, status?: string }): Promise<CommunityMember[]> {
    try {
      await this.setTenantContext(communityId);
      
      let query = this.supabase
        .from('community_members')
        .select('*')
        .eq('community_id', communityId);
      
      if (params?.role) {
        query = query.eq('role', params.role);
      }
      
      if (params?.status) {
        query = query.eq('status', params.status);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getMember(communityId: string, userId: string): Promise<CommunityMember | null> {
    try {
      await this.setTenantContext(communityId);
      
      const { data, error } = await this.supabase
        .from('community_members')
        .select('*')
        .eq('community_id', communityId)
        .eq('user_id', userId)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') return null; // No rows found
        throw error;
      }
      
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async addMember(member: CommunityMember): Promise<CommunityMember> {
    try {
      await this.setTenantContext(member.community_id);
      
      const newMember = {
        id: uuidv4(),
        ...member,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await this.supabase
        .from('community_members')
        .insert([newMember])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateMember(communityId: string, userId: string, updates: Partial<CommunityMember>): Promise<CommunityMember> {
    try {
      await this.setTenantContext(communityId);
      
      const updatedMember = {
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await this.supabase
        .from('community_members')
        .update(updatedMember)
        .eq('community_id', communityId)
        .eq('user_id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async removeMember(communityId: string, userId: string): Promise<void> {
    try {
      await this.setTenantContext(communityId);
      
      const { error } = await this.supabase
        .from('community_members')
        .delete()
        .eq('community_id', communityId)
        .eq('user_id', userId);
      
      if (error) throw error;
    } catch (error) {
      this.handleError(error);
    }
  }
  
  // Subscription plans
  async getSubscriptionPlans(communityId: string, includeInactive: boolean = false): Promise<SubscriptionPlan[]> {
    try {
      await this.setTenantContext(communityId);
      
      let query = this.supabase
        .from('subscription_plans')
        .select('*')
        .eq('community_id', communityId);
      
      if (!includeInactive) {
        query = query.eq('is_active', true);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      return this.handleError(error);
    }
  }

  async createSubscriptionPlan(plan: SubscriptionPlan): Promise<SubscriptionPlan> {
    try {
      await this.setTenantContext(plan.community_id);
      
      const newPlan = {
        id: uuidv4(),
        ...plan,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await this.supabase
        .from('subscription_plans')
        .insert([newPlan])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateSubscriptionPlan(id: string, plan: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> {
    try {
      // First get the plan to get the community_id
      const { data: existingPlan, error: fetchError } = await this.supabase
        .from('subscription_plans')
        .select('community_id')
        .eq('id', id)
        .single();
      
      if (fetchError) throw fetchError;
      
      await this.setTenantContext(existingPlan.community_id);
      
      const updatedPlan = {
        ...plan,
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await this.supabase
        .from('subscription_plans')
        .update(updatedPlan)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deleteSubscriptionPlan(id: string): Promise<void> {
    try {
      // First get the plan to get the community_id
      const { data: existingPlan, error: fetchError } = await this.supabase
        .from('subscription_plans')
        .select('community_id')
        .eq('id', id)
        .single();
      
      if (fetchError) throw fetchError;
      
      await this.setTenantContext(existingPlan.community_id);
      
      const { error } = await this.supabase
        .from('subscription_plans')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      this.handleError(error);
    }
  }
}
