import { SupabaseClient } from '@supabase/supabase-js';
import { IDiscussionRepository } from '@/api/interfaces/IDiscussionRepository';
import { BaseRepository } from '@/api/repositories/BaseRepository';
import { DiscussionTopic, Discussion, DiscussionReply } from '@/types/discussion';

export class SupabaseDiscussionRepository extends BaseRepository implements IDiscussionRepository {
  constructor(supabase: SupabaseClient, communityId?: string) {
    super(supabase, communityId);
  }

  async getAllTopics(): Promise<DiscussionTopic[]> {
    try {
      const { data, error } = await this.supabase
        .from('discussion_topics')
        .select('*')
        .eq('community_id', this.currentCommunityId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      this.handleError(error);
      return [];
    }
  }

  async getTopicById(id: string): Promise<DiscussionTopic> {
    try {
      const { data, error } = await this.supabase
        .from('discussion_topics')
        .select('*')
        .eq('id', id)
        .eq('community_id', this.currentCommunityId)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async createTopic(topic: Partial<DiscussionTopic>): Promise<DiscussionTopic> {
    try {
      const { data, error } = await this.supabase
        .from('discussion_topics')
        .insert({
          ...topic,
          community_id: this.currentCommunityId
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async updateTopic(id: string, data: Partial<DiscussionTopic>): Promise<DiscussionTopic> {
    try {
      const { data: updatedTopic, error } = await this.supabase
        .from('discussion_topics')
        .update(data)
        .eq('id', id)
        .eq('community_id', this.currentCommunityId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return updatedTopic;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async deleteTopic(id: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('discussion_topics')
        .delete()
        .eq('id', id)
        .eq('community_id', this.currentCommunityId);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      this.handleError(error);
      return false;
    }
  }

  async getDiscussionsByTopic(topicId: string): Promise<Discussion[]> {
    try {
      // First get basic discussions data
      const { data: discussions, error } = await this.supabase
        .from('discussions')
        .select(`
          id,
          title,
          content,
          topic_id,
          author_id,
          created_at,
          updated_at,
          is_pinned,
          view_count,
          is_closed,
          community_id
        `)
        .eq('topic_id', topicId)
        .eq('community_id', this.currentCommunityId)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Enhanced discussions with author details, reply counts, etc.
      const enhancedDiscussions = await Promise.all(discussions.map(async (discussion) => {
        // Get author details
        const { data: authorData } = await this.supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .eq('id', discussion.author_id)
          .single();

        // Get reply count
        const { count: replyCount, error: replyError } = await this.supabase
          .from('discussion_replies')
          .select('id', { count: 'exact', head: true })
          .eq('discussion_id', discussion.id);

        if (replyError) {
          console.error('Error fetching reply count:', replyError);
        }

        // Check if any replies are marked as solution
        const { data: solutionData, error: solutionError } = await this.supabase
          .from('discussion_replies')
          .select('id')
          .eq('discussion_id', discussion.id)
          .eq('is_solution', true)
          .limit(1);

        if (solutionError) {
          console.error('Error checking for solution:', solutionError);
        }

        // Get upvote count
        const { count: upvoteCount, error: upvoteError } = await this.supabase
          .from('discussion_likes')
          .select('id', { count: 'exact', head: true })
          .eq('discussion_id', discussion.id);

        if (upvoteError) {
          console.error('Error fetching upvote count:', upvoteError);
        }

        return {
          ...discussion,
          author: authorData ? {
            id: authorData.id,
            name: authorData.full_name,
            avatar: authorData.avatar_url
          } : undefined,
          replies: replyCount || 0,
          isAnswered: solutionData && solutionData.length > 0,
          upvotes: upvoteCount || 0,
          // Basic heuristic for "hot" discussions
          isHot: (upvoteCount || 0) > 5 || (replyCount || 0) > 10
        };
      }));

      return enhancedDiscussions;
    } catch (error) {
      this.handleError(error);
      return [];
    }
  }

  async getDiscussion(id: string): Promise<Discussion> {
    try {
      // Get basic discussion data
      const { data: discussion, error } = await this.supabase
        .from('discussions')
        .select('*')
        .eq('id', id)
        .eq('community_id', this.currentCommunityId)
        .single();

      if (error) {
        throw error;
      }

      // Get author details
      const { data: authorData } = await this.supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .eq('id', discussion.author_id)
        .single();

      // Get discussion replies
      const { data: replies, error: repliesError } = await this.supabase
        .from('discussion_replies')
        .select('*')
        .eq('discussion_id', id)
        .order('is_solution', { ascending: false })
        .order('created_at', { ascending: false });

      if (repliesError) {
        console.error('Error fetching replies:', repliesError);
      }

      // Get upvote count
      const { count: upvoteCount, error: upvoteError } = await this.supabase
        .from('discussion_likes')
        .select('id', { count: 'exact', head: true })
        .eq('discussion_id', id);

      if (upvoteError) {
        console.error('Error fetching upvote count:', upvoteError);
      }

      // Enhanced replies with author details
      const enhancedReplies = await Promise.all((replies || []).map(async (reply) => {
        const { data: replyAuthorData } = await this.supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .eq('id', reply.author_id)
          .single();

        return {
          ...reply,
          author: replyAuthorData ? {
            id: replyAuthorData.id,
            name: replyAuthorData.full_name,
            avatar: replyAuthorData.avatar_url
          } : undefined
        };
      }));

      // Check if any replies are marked as solution
      const hasSolution = enhancedReplies.some(reply => reply.is_solution);

      return {
        ...discussion,
        author: authorData ? {
          id: authorData.id,
          name: authorData.full_name,
          avatar: authorData.avatar_url
        } : undefined,
        replies: enhancedReplies,
        isAnswered: hasSolution,
        upvotes: upvoteCount || 0,
        // Basic heuristic for "hot" discussions
        isHot: (upvoteCount || 0) > 5 || enhancedReplies.length > 10
      };
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async createDiscussion(discussion: Partial<Discussion>): Promise<Discussion> {
    try {
      const { data, error } = await this.supabase
        .from('discussions')
        .insert({
          ...discussion,
          community_id: this.currentCommunityId,
          created_at: new Date().toISOString(),
          view_count: 0,
          is_pinned: false,
          is_closed: false
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        ...data,
        author: {
          id: discussion.user_id || discussion.author_id,
          name: '', // Would be populated from profile in getDiscussion
          avatar: ''
        },
        replies: 0,
        upvotes: 0,
        isHot: false,
        isAnswered: false
      };
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async updateDiscussion(id: string, data: Partial<Discussion>): Promise<Discussion> {
    try {
      const { data: updatedDiscussion, error } = await this.supabase
        .from('discussions')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('community_id', this.currentCommunityId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return updatedDiscussion;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async deleteDiscussion(id: string): Promise<boolean> {
    try {
      // First delete all replies
      await this.supabase
        .from('discussion_replies')
        .delete()
        .eq('discussion_id', id);

      // Then delete the discussion
      const { error } = await this.supabase
        .from('discussions')
        .delete()
        .eq('id', id)
        .eq('community_id', this.currentCommunityId);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      this.handleError(error);
      return false;
    }
  }

  async incrementViewCount(id: string): Promise<boolean> {
    try {
      // Get current view count
      const { data: discussion, error: fetchError } = await this.supabase
        .from('discussions')
        .select('view_count')
        .eq('id', id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      // Increment view count
      const { error: updateError } = await this.supabase
        .from('discussions')
        .update({
          view_count: (discussion.view_count || 0) + 1
        })
        .eq('id', id);

      if (updateError) {
        throw updateError;
      }

      return true;
    } catch (error) {
      this.handleError(error);
      return false;
    }
  }

  async addReply(discussionId: string, reply: Partial<DiscussionReply>): Promise<DiscussionReply> {
    try {
      const { data, error } = await this.supabase
        .from('discussion_replies')
        .insert({
          discussion_id: discussionId,
          content: reply.content,
          author_id: reply.user_id,
          created_at: new Date().toISOString(),
          is_solution: false
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Get author details
      const { data: authorData } = await this.supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .eq('id', reply.user_id)
        .single();

      return {
        ...data,
        author: authorData ? {
          id: authorData.id,
          name: authorData.full_name,
          avatar: authorData.avatar_url
        } : undefined
      };
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async updateReply(id: string, data: Partial<DiscussionReply>): Promise<DiscussionReply> {
    try {
      const { data: updatedReply, error } = await this.supabase
        .from('discussion_replies')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return updatedReply;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async deleteReply(id: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('discussion_replies')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      this.handleError(error);
      return false;
    }
  }

  async markReplyAsSolution(id: string): Promise<DiscussionReply> {
    try {
      // First, find the discussion ID
      const { data: reply, error: findError } = await this.supabase
        .from('discussion_replies')
        .select('discussion_id')
        .eq('id', id)
        .single();

      if (findError) {
        throw findError;
      }

      // Reset all replies for this discussion
      await this.supabase
        .from('discussion_replies')
        .update({ is_solution: false })
        .eq('discussion_id', reply.discussion_id);

      // Mark this reply as solution
      const { data: updatedReply, error } = await this.supabase
        .from('discussion_replies')
        .update({ is_solution: true })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return updatedReply;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async upvoteDiscussion(discussionId: string, isUpvoted: boolean): Promise<boolean> {
    try {
      const userId = (await this.supabase.auth.getUser()).data.user?.id;
      
      if (!userId) {
        throw new Error('User is not authenticated');
      }

      if (isUpvoted) {
        // Add upvote
        const { error } = await this.supabase
          .from('discussion_likes')
          .insert({
            discussion_id: discussionId,
            user_id: userId,
            created_at: new Date().toISOString()
          });

        if (error) {
          // If already upvoted, this is not an error
          if (error.code === '23505') { // Unique violation
            return true;
          }
          throw error;
        }
      } else {
        // Remove upvote
        const { error } = await this.supabase
          .from('discussion_likes')
          .delete()
          .eq('discussion_id', discussionId)
          .eq('user_id', userId);

        if (error) {
          throw error;
        }
      }

      return true;
    } catch (error) {
      this.handleError(error);
      return false;
    }
  }

  async getDiscussionUpvotes(discussionId: string): Promise<string[]> {
    try {
      const { data, error } = await this.supabase
        .from('discussion_likes')
        .select('user_id')
        .eq('discussion_id', discussionId);

      if (error) {
        throw error;
      }

      return data.map(item => item.user_id);
    } catch (error) {
      this.handleError(error);
      return [];
    }
  }

  async checkUserUpvoted(discussionId: string, userId: string): Promise<boolean> {
    try {
      const { data, error } = await this.supabase
        .from('discussion_likes')
        .select('id')
        .eq('discussion_id', discussionId)
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') { // No rows returned
          return false;
        }
        throw error;
      }

      return !!data;
    } catch (error) {
      this.handleError(error);
      return false;
    }
  }
}
