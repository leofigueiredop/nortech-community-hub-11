import { SupabaseClient } from '@supabase/supabase-js';
import { IMembersRepository, MemberFilters } from '@/api/interfaces/IMembersRepository';
import { BaseRepository } from './BaseRepository';
import { Result } from '@/types/api';
import { CommunityMember } from '@/types/community';
import { subDays } from 'date-fns';

export class SupabaseMembersRepository extends BaseRepository implements IMembersRepository {
  constructor(supabase: SupabaseClient) {
    super(supabase);
  }

  async getAllMembers(filters?: MemberFilters): Promise<Result<CommunityMember[]>> {
    try {
      if (!this.currentCommunityId) {
        return { ok: false, error: { message: 'Community context is required' } };
      }

      // Start the query
      let query = this.supabase
        .from('community_members')
        .select(`
          id,
          community_id,
          user_id,
          role,
          status,
          joined_at,
          created_at,
          updated_at
        `)
        .eq('community_id', this.currentCommunityId);

      // Apply filters
      if (filters) {
        // Role filter
        if (filters.role) {
          if (Array.isArray(filters.role)) {
            query = query.in('role', filters.role);
          } else {
            query = query.eq('role', filters.role);
          }
        }

        // Status filter
        if (filters.status) {
          if (Array.isArray(filters.status)) {
            query = query.in('status', filters.status);
          } else {
            query = query.eq('status', filters.status);
          }
        }

        // Pagination
        if (typeof filters.limit === 'number') {
          query = query.limit(filters.limit);
        }
        
        if (typeof filters.offset === 'number') {
          query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
        }
      }

      const { data: members, error } = await query.order('joined_at', { ascending: false });

      if (error) throw error;

      // Get profiles for all members
      const userIds = members.map(member => member.user_id);
      
      // Fetch profiles
      const { data: profiles, error: profilesError } = await this.supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', userIds);
      
      if (profilesError) throw profilesError;
      
      // Create a map of profiles by user ID
      const profileMap = new Map();
      profiles?.forEach(profile => {
        profileMap.set(profile.id, profile);
      });
      
      // Fetch emails if needed (this would normally be in the auth service)
      // For simplicity, we'll just use placeholder emails
      
      // Combine the data
      const completeMembers: CommunityMember[] = members.map(member => {
        const profile = profileMap.get(member.user_id);
        
        return {
          id: member.id,
          community_id: member.community_id,
          user_id: member.user_id,
          role: member.role,
          status: member.status,
          joined_at: member.joined_at,
          points: 0, // Will need to be fetched separately if needed
          created_at: member.created_at,
          updated_at: member.updated_at,
          profile: {
            name: profile?.full_name || 'Unknown User',
            avatar_url: profile?.avatar_url,
            email: `user-${member.user_id.slice(0, 8)}@example.com` // Placeholder email
          }
        };
      });

      // If there's a search filter, filter the results in JS
      if (filters?.search) {
        const search = filters.search.toLowerCase();
        const filteredMembers = completeMembers.filter(member => 
          member.profile.name.toLowerCase().includes(search) ||
          member.profile.email.toLowerCase().includes(search)
        );
        return { ok: true, data: filteredMembers };
      }

      return { ok: true, data: completeMembers };
    } catch (error) {
      console.error('Failed to fetch community members:', error);
      return { ok: false, error };
    }
  }

  async getMemberById(userId: string): Promise<Result<CommunityMember | null>> {
    try {
      if (!this.currentCommunityId) {
        return { ok: false, error: { message: 'Community context is required' } };
      }

      const { data: member, error } = await this.supabase
        .from('community_members')
        .select('*')
        .eq('community_id', this.currentCommunityId)
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      if (!member) return { ok: true, data: null };

      // Get profile data
      const { data: profile, error: profileError } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profileError) throw profileError;
      
      const memberData: CommunityMember = {
        id: member.id,
        community_id: member.community_id,
        user_id: member.user_id,
        role: member.role,
        status: member.status,
        joined_at: member.joined_at,
        points: 0, // Will need to be fetched separately if needed
        created_at: member.created_at,
        updated_at: member.updated_at,
        profile: {
          name: profile?.full_name || 'Unknown User',
          avatar_url: profile?.avatar_url,
          email: `user-${member.user_id.slice(0, 8)}@example.com` // Placeholder email
        }
      };

      return { ok: true, data: memberData };
    } catch (error) {
      console.error('Failed to fetch community member:', error);
      return { ok: false, error };
    }
  }

  async updateMemberRole(userId: string, role: string): Promise<Result<void>> {
    try {
      if (!this.currentCommunityId) {
        return { ok: false, error: { message: 'Community context is required' } };
      }

      const { error } = await this.supabase
        .from('community_members')
        .update({ role })
        .eq('community_id', this.currentCommunityId)
        .eq('user_id', userId);

      if (error) throw error;

      return { ok: true, data: undefined };
    } catch (error) {
      console.error('Failed to update member role:', error);
      return { ok: false, error };
    }
  }

  async getMembersCount(): Promise<Result<number>> {
    try {
      if (!this.currentCommunityId) {
        return { ok: false, error: { message: 'Community context is required' } };
      }

      const { count, error } = await this.supabase
        .from('community_members')
        .select('id', { count: 'exact', head: true })
        .eq('community_id', this.currentCommunityId);

      if (error) throw error;

      return { ok: true, data: count || 0 };
    } catch (error) {
      console.error('Failed to get members count:', error);
      return { ok: false, error };
    }
  }

  async getNewMembersCount(days: number): Promise<Result<number>> {
    try {
      if (!this.currentCommunityId) {
        return { ok: false, error: { message: 'Community context is required' } };
      }

      const dateThreshold = subDays(new Date(), days).toISOString();

      const { count, error } = await this.supabase
        .from('community_members')
        .select('id', { count: 'exact', head: true })
        .eq('community_id', this.currentCommunityId)
        .gte('joined_at', dateThreshold);

      if (error) throw error;

      return { ok: true, data: count || 0 };
    } catch (error) {
      console.error('Failed to get new members count:', error);
      return { ok: false, error };
    }
  }

  async inviteMember(email: string, role: string = 'member'): Promise<Result<void>> {
    try {
      if (!this.currentCommunityId) {
        return { ok: false, error: { message: 'Community context is required' } };
      }

      // This would typically integrate with an email service or Supabase auth
      // For demonstration purposes, we'll return a success but in reality
      // you would need to implement the actual invitation logic
      
      return { ok: true, data: undefined };
    } catch (error) {
      console.error('Failed to invite member:', error);
      return { ok: false, error };
    }
  }

  async removeMember(userId: string): Promise<Result<void>> {
    try {
      if (!this.currentCommunityId) {
        return { ok: false, error: { message: 'Community context is required' } };
      }

      const { error } = await this.supabase
        .from('community_members')
        .delete()
        .eq('community_id', this.currentCommunityId)
        .eq('user_id', userId);

      if (error) throw error;

      return { ok: true, data: undefined };
    } catch (error) {
      console.error('Failed to remove member:', error);
      return { ok: false, error };
    }
  }
} 