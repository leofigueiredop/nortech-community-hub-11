import { BaseRepository } from './BaseRepository';
import { IInviteRepository, InviteData } from '../interfaces/IInviteRepository';

export class SupabaseInviteRepository extends BaseRepository implements IInviteRepository {
  
  async createInvite(email: string, role: string, invitedBy: string): Promise<{ data?: InviteData; error?: any }> {
    try {
      console.log('Creating invite with:', {
        email,
        role,
        invitedBy,
        currentCommunityId: this.currentCommunityId
      });

      if (!this.currentCommunityId) {
        throw new Error('Community context not set');
      }

      // Set expiration to 7 days from now
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const insertData = {
        email,
        role,
        community_id: this.currentCommunityId,
        invited_by: invitedBy,
        status: 'pending',
        expires_at: expiresAt.toISOString()
      };

      console.log('Insert data:', insertData);

      const { data, error } = await this.supabase
        .from('invitations')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Failed to create invitation:', error);
        return { error };
      }

      return { data };
    } catch (error) {
      console.error('Failed to create invitation:', error);
      return { error };
    }
  }

  async getInvite(email: string, communityId: string): Promise<{ data?: InviteData; error?: any }> {
    try {
      const { data, error } = await this.supabase
        .from('invitations')
        .select('*')
        .eq('email', email)
        .eq('community_id', communityId)
        .eq('status', 'pending')
        .gt('expires_at', new Date().toISOString())
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned - invitation not found or expired
          return { data: undefined };
        }
        console.error('Failed to get invitation:', error);
        return { error };
      }

      return { data };
    } catch (error) {
      console.error('Failed to get invitation:', error);
      return { error };
    }
  }

  async acceptInvite(inviteId: string, userId: string): Promise<{ data?: boolean; error?: any }> {
    try {
      // Start a transaction to update invitation and add member
      const { data: invite, error: inviteError } = await this.supabase
        .from('invitations')
        .select('*')
        .eq('id', inviteId)
        .eq('status', 'pending')
        .gt('expires_at', new Date().toISOString())
        .single();

      if (inviteError || !invite) {
        console.error('Invitation not found or expired:', inviteError);
        return { error: inviteError || 'Invitation not found' };
      }

      // Update invitation status
      const { error: updateError } = await this.supabase
        .from('invitations')
        .update({ status: 'accepted' })
        .eq('id', inviteId);

      if (updateError) {
        console.error('Failed to update invitation:', updateError);
        return { error: updateError };
      }

      // Add user to community members
      const { error: memberError } = await this.supabase
        .from('community_members')
        .insert({
          community_id: invite.community_id,
          user_id: userId,
          role: invite.role,
          status: 'active'
        });

      if (memberError) {
        // If adding member fails, revert invitation status
        await this.supabase
          .from('invitations')
          .update({ status: 'pending' })
          .eq('id', inviteId);
        
        console.error('Failed to add member to community:', memberError);
        return { error: memberError };
      }

      return { data: true };
    } catch (error) {
      console.error('Failed to accept invitation:', error);
      return { error };
    }
  }

  async validateInvite(email: string, communityId: string): Promise<{ data?: boolean; error?: any }> {
    try {
      const { data, error } = await this.supabase
        .from('invitations')
        .select('id')
        .eq('email', email)
        .eq('community_id', communityId)
        .eq('status', 'pending')
        .gt('expires_at', new Date().toISOString())
        .limit(1);

      if (error) {
        console.error('Failed to validate invitation:', error);
        return { error };
      }

      return { data: data && data.length > 0 };
    } catch (error) {
      console.error('Failed to validate invitation:', error);
      return { error };
    }
  }

  async getPendingInvites(): Promise<{ data?: InviteData[]; error?: any }> {
    try {
      const { data, error } = await this.supabase
        .from('invitations')
        .select(`
          *,
          inviter:profiles!invited_by(full_name, email)
        `)
        .eq('community_id', this.currentCommunityId)
        .eq('status', 'pending')
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to get pending invitations:', error);
        return { error };
      }

      return { data: data || [] };
    } catch (error) {
      console.error('Failed to get pending invitations:', error);
      return { error };
    }
  }

  async cancelInvite(inviteId: string): Promise<{ data?: boolean; error?: any }> {
    try {
      const { error } = await this.supabase
        .from('invitations')
        .update({ status: 'cancelled' })
        .eq('id', inviteId)
        .eq('community_id', this.currentCommunityId);

      if (error) {
        console.error('Failed to cancel invitation:', error);
        return { error };
      }

      return { data: true };
    } catch (error) {
      console.error('Failed to cancel invitation:', error);
      return { error };
    }
  }
} 