import { SupabaseClient } from '@supabase/supabase-js';
import { IModerationRepository } from '../interfaces/IModerationRepository';
import { Result } from '@/types/result';
import { AppError } from '@/types/error';
import { ModerationAction, ModerationFlag } from '@/types/moderation';

export class SupabaseModerationRepository implements IModerationRepository {
  private currentCommunityId: string | null = null;
  
  constructor(private supabaseClient: SupabaseClient) {}

  setCurrentCommunity(communityId: string): void {
    this.currentCommunityId = communityId;
  }

  private ensureCommunityContext(): Result<void, AppError> {
    if (!this.currentCommunityId) {
      return {
        ok: false,
        error: {
          code: 'COMMUNITY_CONTEXT_MISSING',
          message: 'Community context must be set before performing moderation operations'
        }
      };
    }
    return { ok: true, data: undefined };
  }

  async flagContent(
    contentId: string,
    contentType: 'post' | 'comment',
    reason: string,
    reporterId: string
  ): Promise<Result<ModerationFlag, AppError>> {
    const contextCheck = this.ensureCommunityContext();
    if (!contextCheck.ok) return contextCheck;

    try {
      const { data, error } = await this.supabaseClient
        .from('moderation_flags')
        .insert({
          content_id: contentId,
          content_type: contentType,
          reason,
          reporter_id: reporterId,
          community_id: this.currentCommunityId,
          status: 'pending',
          reported_at: new Date().toISOString()
        })
        .select('*')
        .single();

      if (error) throw error;

      return {
        ok: true,
        data: this.transformFlagData(data)
      };
    } catch (error) {
      return {
        ok: false,
        error: {
          code: 'FLAG_CONTENT_ERROR',
          message: 'Failed to flag content for moderation',
          cause: error
        }
      };
    }
  }

  async getPendingFlags(
    page = 1,
    limit = 10
  ): Promise<Result<{ flags: ModerationFlag[]; total: number }, AppError>> {
    const contextCheck = this.ensureCommunityContext();
    if (!contextCheck.ok) return contextCheck;

    try {
      const offset = (page - 1) * limit;

      const [{ data: flags, error }, { count, error: countError }] = await Promise.all([
        this.supabaseClient
          .from('moderation_flags')
          .select('*')
          .eq('community_id', this.currentCommunityId)
          .eq('status', 'pending')
          .order('reported_at', { ascending: false })
          .range(offset, offset + limit - 1),
        this.supabaseClient
          .from('moderation_flags')
          .select('*', { count: 'exact', head: true })
          .eq('community_id', this.currentCommunityId)
          .eq('status', 'pending')
      ]);

      if (error || countError) throw error || countError;

      return {
        ok: true,
        data: {
          flags: flags.map(this.transformFlagData),
          total: count || 0
        }
      };
    } catch (error) {
      return {
        ok: false,
        error: {
          code: 'FETCH_PENDING_FLAGS_ERROR',
          message: 'Failed to fetch pending moderation flags',
          cause: error
        }
      };
    }
  }

  async reviewFlag(
    flagId: string,
    moderatorId: string,
    action: ModerationAction
  ): Promise<Result<ModerationFlag, AppError>> {
    const contextCheck = this.ensureCommunityContext();
    if (!contextCheck.ok) return contextCheck;

    try {
      const { data, error } = await this.supabaseClient
        .from('moderation_flags')
        .update({
          status: 'reviewed',
          moderator_id: moderatorId,
          reviewed_at: new Date().toISOString(),
          action
        })
        .eq('id', flagId)
        .eq('community_id', this.currentCommunityId)
        .select('*')
        .single();

      if (error) throw error;

      // If action is 'remove' or 'ban', perform the corresponding operation
      if (action.type === 'remove') {
        await this.removeContent(data.content_id, data.content_type);
      } else if (action.type === 'ban') {
        await this.banUser(data.reporter_id, moderatorId, action.duration, action.notes);
      }

      return {
        ok: true,
        data: this.transformFlagData(data)
      };
    } catch (error) {
      return {
        ok: false,
        error: {
          code: 'REVIEW_FLAG_ERROR',
          message: 'Failed to review moderation flag',
          cause: error
        }
      };
    }
  }

  async getModerationHistory(
    page = 1,
    limit = 10,
    status?: 'reviewed' | 'resolved'
  ): Promise<Result<{ flags: ModerationFlag[]; total: number }, AppError>> {
    const contextCheck = this.ensureCommunityContext();
    if (!contextCheck.ok) return contextCheck;

    try {
      const offset = (page - 1) * limit;
      let query = this.supabaseClient
        .from('moderation_flags')
        .select('*')
        .eq('community_id', this.currentCommunityId);

      if (status) {
        query = query.eq('status', status);
      } else {
        query = query.neq('status', 'pending');
      }

      const [{ data: flags, error }, { count, error: countError }] = await Promise.all([
        query
          .order('reviewed_at', { ascending: false })
          .range(offset, offset + limit - 1),
        query.select('*', { count: 'exact', head: true })
      ]);

      if (error || countError) throw error || countError;

      return {
        ok: true,
        data: {
          flags: flags.map(this.transformFlagData),
          total: count || 0
        }
      };
    } catch (error) {
      return {
        ok: false,
        error: {
          code: 'FETCH_HISTORY_ERROR',
          message: 'Failed to fetch moderation history',
          cause: error
        }
      };
    }
  }

  async banUser(
    userId: string,
    moderatorId: string,
    duration?: number,
    reason?: string
  ): Promise<Result<void, AppError>> {
    const contextCheck = this.ensureCommunityContext();
    if (!contextCheck.ok) return contextCheck;

    try {
      const expiresAt = duration 
        ? new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toISOString()
        : null;

      const { error } = await this.supabaseClient
        .from('community_bans')
        .upsert({
          user_id: userId,
          community_id: this.currentCommunityId,
          moderator_id: moderatorId,
          reason,
          expires_at: expiresAt,
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      return { ok: true, data: undefined };
    } catch (error) {
      return {
        ok: false,
        error: {
          code: 'BAN_USER_ERROR',
          message: 'Failed to ban user from community',
          cause: error
        }
      };
    }
  }

  async unbanUser(
    userId: string,
    moderatorId: string
  ): Promise<Result<void, AppError>> {
    const contextCheck = this.ensureCommunityContext();
    if (!contextCheck.ok) return contextCheck;

    try {
      const { error } = await this.supabaseClient
        .from('community_bans')
        .delete()
        .eq('user_id', userId)
        .eq('community_id', this.currentCommunityId);

      if (error) throw error;

      return { ok: true, data: undefined };
    } catch (error) {
      return {
        ok: false,
        error: {
          code: 'UNBAN_USER_ERROR',
          message: 'Failed to remove user ban',
          cause: error
        }
      };
    }
  }

  async isUserBanned(
    userId: string
  ): Promise<Result<{ banned: boolean; expiry?: Date }, AppError>> {
    const contextCheck = this.ensureCommunityContext();
    if (!contextCheck.ok) return contextCheck;

    try {
      const { data, error } = await this.supabaseClient
        .from('community_bans')
        .select('expires_at')
        .eq('user_id', userId)
        .eq('community_id', this.currentCommunityId)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        return { ok: true, data: { banned: false } };
      }

      const expiry = data.expires_at ? new Date(data.expires_at) : undefined;
      const banned = !expiry || expiry > new Date();

      return {
        ok: true,
        data: {
          banned,
          expiry: expiry
        }
      };
    } catch (error) {
      return {
        ok: false,
        error: {
          code: 'CHECK_BAN_ERROR',
          message: 'Failed to check user ban status',
          cause: error
        }
      };
    }
  }

  async restoreContent(
    contentId: string,
    contentType: 'post' | 'comment',
    moderatorId: string
  ): Promise<Result<void, AppError>> {
    const contextCheck = this.ensureCommunityContext();
    if (!contextCheck.ok) return contextCheck;

    try {
      const table = contentType === 'post' ? 'posts' : 'comments';
      const { error } = await this.supabaseClient
        .from(table)
        .update({
          removed_at: null,
          removed_by: null
        })
        .eq('id', contentId)
        .eq('community_id', this.currentCommunityId);

      if (error) throw error;

      return { ok: true, data: undefined };
    } catch (error) {
      return {
        ok: false,
        error: {
          code: 'RESTORE_CONTENT_ERROR',
          message: 'Failed to restore content',
          cause: error
        }
      };
    }
  }

  private async removeContent(
    contentId: string,
    contentType: 'post' | 'comment'
  ): Promise<void> {
    const table = contentType === 'post' ? 'posts' : 'comments';
    await this.supabaseClient
      .from(table)
      .update({
        removed_at: new Date().toISOString(),
        removed_by: 'moderator'
      })
      .eq('id', contentId)
      .eq('community_id', this.currentCommunityId);
  }

  private transformFlagData(data: any): ModerationFlag {
    return {
      id: data.id,
      contentId: data.content_id,
      contentType: data.content_type,
      reason: data.reason,
      reporterId: data.reporter_id,
      reportedAt: new Date(data.reported_at),
      status: data.status,
      communityId: data.community_id,
      moderatorId: data.moderator_id,
      reviewedAt: data.reviewed_at ? new Date(data.reviewed_at) : undefined,
      action: data.action
    };
  }
} 