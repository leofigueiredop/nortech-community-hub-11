import { SupabaseClient } from '@supabase/supabase-js';
import { IPostReactionsRepository } from '../interfaces/IPostReactionsRepository';
import { AppError } from '@/types/error';
import { PostReaction, ReactionType } from '@/types/discussions';

export class SupabasePostReactionsRepository implements IPostReactionsRepository {
  private supabase: SupabaseClient;
  private currentCommunityId: string | null = null;

  constructor(supabaseClient: SupabaseClient) {
    this.supabase = supabaseClient;
  }

  setCurrentCommunity(communityId: string): void {
    this.currentCommunityId = communityId;
  }

  private ensureCommunityContext(): AppError | null {
    if (!this.currentCommunityId) {
      return {
        code: 'COMMUNITY_CONTEXT_MISSING',
        message: 'Community context must be set before performing operations'
      };
    }
    return null;
  }

  async addReaction(postId: string, userId: string, reactionType: ReactionType): Promise<AppError | null> {
    const contextError = this.ensureCommunityContext();
    if (contextError) return contextError;

    try {
      const { error } = await this.supabase
        .from('post_reactions')
        .upsert({
          post_id: postId,
          user_id: userId,
          reaction_type: reactionType,
          community_id: this.currentCommunityId
        });

      if (error) {
        return {
          code: 'ADD_REACTION_ERROR',
          message: 'Failed to add reaction to post',
          details: { error: error.message }
        };
      }

      return null;
    } catch (error) {
      return {
        code: 'ADD_REACTION_ERROR',
        message: 'An unexpected error occurred while adding reaction',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      };
    }
  }

  async removeReaction(postId: string, userId: string): Promise<AppError | null> {
    const contextError = this.ensureCommunityContext();
    if (contextError) return contextError;

    try {
      const { error } = await this.supabase
        .from('post_reactions')
        .delete()
        .match({ 
          post_id: postId, 
          user_id: userId,
          community_id: this.currentCommunityId 
        });

      if (error) {
        return {
          code: 'REMOVE_REACTION_ERROR',
          message: 'Failed to remove reaction from post',
          details: { error: error.message }
        };
      }

      return null;
    } catch (error) {
      return {
        code: 'REMOVE_REACTION_ERROR',
        message: 'An unexpected error occurred while removing reaction',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      };
    }
  }

  async getReactions(postId: string): Promise<{ data: PostReaction[] | null; error: AppError | null }> {
    const contextError = this.ensureCommunityContext();
    if (contextError) return { data: null, error: contextError };

    try {
      const { data, error } = await this.supabase
        .from('post_reactions')
        .select('*')
        .match({ 
          post_id: postId,
          community_id: this.currentCommunityId 
        });

      if (error) {
        return {
          data: null,
          error: {
            code: 'FETCH_REACTIONS_ERROR',
            message: 'Failed to fetch reactions for post',
            details: { error: error.message }
          }
        };
      }

      return { 
        data: data as PostReaction[],
        error: null 
      };
    } catch (error) {
      return {
        data: null,
        error: {
          code: 'FETCH_REACTIONS_ERROR',
          message: 'An unexpected error occurred while fetching reactions',
          details: { error: error instanceof Error ? error.message : 'Unknown error' }
        }
      };
    }
  }

  async getUserReaction(postId: string, userId: string): Promise<{ data: PostReaction | null; error: AppError | null }> {
    const contextError = this.ensureCommunityContext();
    if (contextError) return { data: null, error: contextError };

    try {
      const { data, error } = await this.supabase
        .from('post_reactions')
        .select('*')
        .match({ 
          post_id: postId, 
          user_id: userId,
          community_id: this.currentCommunityId 
        })
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No reaction found
          return { data: null, error: null };
        }
        return {
          data: null,
          error: {
            code: 'FETCH_USER_REACTION_ERROR',
            message: 'Failed to fetch user reaction for post',
            details: { error: error.message }
          }
        };
      }

      return { 
        data: data as PostReaction,
        error: null 
      };
    } catch (error) {
      return {
        data: null,
        error: {
          code: 'FETCH_USER_REACTION_ERROR',
          message: 'An unexpected error occurred while fetching user reaction',
          details: { error: error instanceof Error ? error.message : 'Unknown error' }
        }
      };
    }
  }
} 