import { SupabaseClient } from '@supabase/supabase-js';
import { Result } from '@/types/result';
import { AppError } from '@/types/error';

interface PointsSettings {
  post_creation: number;
  comment: number;
  reaction_received: number;
  featured_post: number;
}

export class DiscussionPointsService {
  private currentCommunityId: string | null = null;

  constructor(private supabaseClient: SupabaseClient) {}

  setCurrentCommunity(communityId: string): void {
    this.currentCommunityId = communityId;
  }

  private ensureCommunityContext(): Result<true, AppError> {
    if (!this.currentCommunityId) {
      return {
        ok: false,
        error: {
          code: 'COMMUNITY_CONTEXT_MISSING',
          message: 'Community context must be set before performing points operations'
        }
      };
    }
    return { ok: true, data: true };
  }

  /**
   * Awards points for creating a new discussion post
   */
  async awardPostCreationPoints(userId: string): Promise<Result<number, AppError>> {
    const contextCheck = this.ensureCommunityContext();
    if (!contextCheck.ok) return { ok: false, error: contextCheck.error };

    try {
      // Get points configuration for post creation
      const { data: config, error: configError } = await this.supabaseClient
        .from('points_settings')
        .select('post_creation')
        .eq('community_id', this.currentCommunityId)
        .single();

      if (configError) throw configError;

      const points = config?.post_creation || 5; // Default 5 points

      // Add points transaction
      const { error: transactionError } = await this.supabaseClient
        .from('points_transactions')
        .insert({
          user_id: userId,
          community_id: this.currentCommunityId,
          points,
          source: 'discussion',
          description: 'Created a new discussion post',
          activity_type: 'post_creation'
        });

      if (transactionError) throw transactionError;

      // Update user's total points
      const { data: totalPoints, error: updateError } = await this.supabaseClient
        .rpc('add_points', {
          user_id: userId,
          community_id: this.currentCommunityId,
          points_to_add: points
        });

      if (updateError) throw updateError;

      return { ok: true, data: totalPoints as number };
    } catch (error) {
      return {
        ok: false,
        error: {
          code: 'AWARD_POINTS_ERROR',
          message: 'Failed to award points for post creation',
          cause: error
        }
      };
    }
  }

  /**
   * Awards points for commenting on a discussion
   */
  async awardCommentPoints(userId: string): Promise<Result<number, AppError>> {
    const contextCheck = this.ensureCommunityContext();
    if (!contextCheck.ok) return { ok: false, error: contextCheck.error };

    try {
      // Get points configuration for commenting
      const { data: config, error: configError } = await this.supabaseClient
        .from('points_settings')
        .select('comment')
        .eq('community_id', this.currentCommunityId)
        .single();

      if (configError) throw configError;

      const points = config?.comment || 2; // Default 2 points

      // Add points transaction
      const { error: transactionError } = await this.supabaseClient
        .from('points_transactions')
        .insert({
          user_id: userId,
          community_id: this.currentCommunityId,
          points,
          source: 'discussion',
          description: 'Added a comment to a discussion',
          activity_type: 'comment'
        });

      if (transactionError) throw transactionError;

      // Update user's total points
      const { data: totalPoints, error: updateError } = await this.supabaseClient
        .rpc('add_points', {
          user_id: userId,
          community_id: this.currentCommunityId,
          points_to_add: points
        });

      if (updateError) throw updateError;

      return { ok: true, data: totalPoints as number };
    } catch (error) {
      return {
        ok: false,
        error: {
          code: 'AWARD_POINTS_ERROR',
          message: 'Failed to award points for commenting',
          cause: error
        }
      };
    }
  }

  /**
   * Awards points for receiving reactions on content
   */
  async awardReactionPoints(
    userId: string,
    reactionType: string
  ): Promise<Result<number, AppError>> {
    const contextCheck = this.ensureCommunityContext();
    if (!contextCheck.ok) return { ok: false, error: contextCheck.error };

    try {
      // Get points configuration for reactions
      const { data: config, error: configError } = await this.supabaseClient
        .from('points_settings')
        .select('reaction_received')
        .eq('community_id', this.currentCommunityId)
        .single();

      if (configError) throw configError;

      const points = config?.reaction_received || 1; // Default 1 point

      // Add points transaction
      const { error: transactionError } = await this.supabaseClient
        .from('points_transactions')
        .insert({
          user_id: userId,
          community_id: this.currentCommunityId,
          points,
          source: 'discussion',
          description: `Received a ${reactionType} reaction`,
          activity_type: 'reaction_received',
          metadata: { reaction_type: reactionType }
        });

      if (transactionError) throw transactionError;

      // Update user's total points
      const { data: totalPoints, error: updateError } = await this.supabaseClient
        .rpc('add_points', {
          user_id: userId,
          community_id: this.currentCommunityId,
          points_to_add: points
        });

      if (updateError) throw updateError;

      return { ok: true, data: totalPoints as number };
    } catch (error) {
      return {
        ok: false,
        error: {
          code: 'AWARD_POINTS_ERROR',
          message: 'Failed to award points for receiving reaction',
          cause: error
        }
      };
    }
  }

  /**
   * Awards points for having a post marked as featured
   */
  async awardFeaturedPostPoints(userId: string): Promise<Result<number, AppError>> {
    const contextCheck = this.ensureCommunityContext();
    if (!contextCheck.ok) return { ok: false, error: contextCheck.error };

    try {
      // Get points configuration for featured posts
      const { data: config, error: configError } = await this.supabaseClient
        .from('points_settings')
        .select('featured_post')
        .eq('community_id', this.currentCommunityId)
        .single();

      if (configError) throw configError;

      const points = config?.featured_post || 10; // Default 10 points

      // Add points transaction
      const { error: transactionError } = await this.supabaseClient
        .from('points_transactions')
        .insert({
          user_id: userId,
          community_id: this.currentCommunityId,
          points,
          source: 'discussion',
          description: 'Post was featured by moderators',
          activity_type: 'featured_post'
        });

      if (transactionError) throw transactionError;

      // Update user's total points
      const { data: totalPoints, error: updateError } = await this.supabaseClient
        .rpc('add_points', {
          user_id: userId,
          community_id: this.currentCommunityId,
          points_to_add: points
        });

      if (updateError) throw updateError;

      return { ok: true, data: totalPoints as number };
    } catch (error) {
      return {
        ok: false,
        error: {
          code: 'AWARD_POINTS_ERROR',
          message: 'Failed to award points for featured post',
          cause: error
        }
      };
    }
  }

  /**
   * Gets the current points balance for a user
   */
  async getUserPoints(userId: string): Promise<Result<number, AppError>> {
    const contextCheck = this.ensureCommunityContext();
    if (!contextCheck.ok) return { ok: false, error: contextCheck.error };

    try {
      const { data, error } = await this.supabaseClient
        .from('user_points')
        .select('points')
        .eq('user_id', userId)
        .eq('community_id', this.currentCommunityId)
        .single();

      if (error) throw error;

      return { ok: true, data: data?.points || 0 };
    } catch (error) {
      return {
        ok: false,
        error: {
          code: 'GET_POINTS_ERROR',
          message: 'Failed to get user points',
          cause: error
        }
      };
    }
  }
} 