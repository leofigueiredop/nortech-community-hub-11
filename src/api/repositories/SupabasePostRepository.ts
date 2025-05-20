import { IPostRepository } from '../interfaces/IPostRepository';
import { SupabaseClient } from '@supabase/supabase-js';
import { BaseRepository } from './BaseRepository';
import { Post, PostComment, PostReaction } from '@/types/post';

export class SupabasePostRepository extends BaseRepository implements IPostRepository {
  constructor(supabaseClient: SupabaseClient) {
    super(supabaseClient);
  }

  async getAll(page: number = 1, limit: number = 10): Promise<{ posts: Post[], total: number }> {
    try {
      // Get total count
      const { count, error: countError } = await this.supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('community_id', this.currentCommunityId);
      
      if (countError) throw countError;
      
      // Get posts with pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      
      const { data, error } = await this.supabase
        .from('posts')
        .select('*, author:profiles(*), reactions_count:post_reactions(count)')
        .eq('community_id', this.currentCommunityId)
        .order('created_at', { ascending: false })
        .range(from, to);
      
      if (error) throw error;
      
      return {
        posts: data as Post[],
        total: count || 0
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getById(id: string): Promise<Post> {
    try {
      const { data, error } = await this.supabase
        .from('posts')
        .select('*, author:profiles(*), comments:post_comments(*, author:profiles(*))')
        .eq('id', id)
        .eq('community_id', this.currentCommunityId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async create(post: Partial<Post>): Promise<Post> {
    try {
      const { data, error } = await this.supabase
        .from('posts')
        .insert([{
          ...post,
          community_id: this.currentCommunityId
        }])
        .select('*, author:profiles(*)')
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async update(id: string, post: Partial<Post>): Promise<Post> {
    try {
      const { data, error } = await this.supabase
        .from('posts')
        .update(post)
        .eq('id', id)
        .eq('community_id', this.currentCommunityId)
        .select('*, author:profiles(*)')
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('posts')
        .delete()
        .eq('id', id)
        .eq('community_id', this.currentCommunityId);
      
      if (error) throw error;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getFeaturedPosts(limit: number = 5): Promise<Post[]> {
    try {
      const { data, error } = await this.supabase
        .from('posts')
        .select('*, author:profiles(*)')
        .eq('community_id', this.currentCommunityId)
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getPostsByUser(userId: string, limit: number = 10): Promise<Post[]> {
    try {
      const { data, error } = await this.supabase
        .from('posts')
        .select('*, author:profiles(*)')
        .eq('community_id', this.currentCommunityId)
        .eq('author_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async addComment(postId: string, comment: Partial<PostComment>): Promise<PostComment> {
    try {
      const { data, error } = await this.supabase
        .from('post_comments')
        .insert([{
          ...comment,
          post_id: postId
        }])
        .select('*, author:profiles(*)')
        .single();
      
      if (error) throw error;
      
      // Update comment count
      await this.supabase
        .rpc('increment_post_comments', {
          post_id_param: postId
        });
      
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getComments(postId: string): Promise<PostComment[]> {
    try {
      const { data, error } = await this.supabase
        .from('post_comments')
        .select('*, author:profiles(*)')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deleteComment(commentId: string): Promise<void> {
    try {
      // Get post_id first to update comment count
      const { data: commentData, error: fetchError } = await this.supabase
        .from('post_comments')
        .select('post_id')
        .eq('id', commentId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Delete comment
      const { error } = await this.supabase
        .from('post_comments')
        .delete()
        .eq('id', commentId);
      
      if (error) throw error;
      
      // Update comment count
      await this.supabase
        .rpc('decrement_post_comments', {
          post_id_param: commentData.post_id
        });
    } catch (error) {
      this.handleError(error);
    }
  }

  async addReaction(postId: string, userId: string, reactionType: string): Promise<PostReaction> {
    try {
      // Remove existing reaction if present
      await this.removeReaction(postId, userId);
      
      // Add new reaction
      const { data, error } = await this.supabase
        .from('post_reactions')
        .insert([{
          post_id: postId,
          user_id: userId,
          reaction_type: reactionType
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async removeReaction(postId: string, userId: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('post_reactions')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId);
      
      if (error) throw error;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getUserReaction(postId: string, userId: string): Promise<PostReaction | null> {
    try {
      const { data, error } = await this.supabase
        .from('post_reactions')
        .select('*')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No record found
          return null;
        }
        throw error;
      }
      
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }
}
