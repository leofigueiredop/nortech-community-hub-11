import { SupabaseClient } from '@supabase/supabase-js';
import { IDiscussionRepository } from '../interfaces/IDiscussionRepository';
import { BaseRepository } from './BaseRepository';
import { DiscussionTopic, Discussion, DiscussionReply } from '@/types/discussion';

export class SupabaseDiscussionRepository extends BaseRepository implements IDiscussionRepository {
  constructor(supabaseClient: SupabaseClient) {
    super(supabaseClient);
  }

  async getAllTopics(): Promise<DiscussionTopic[]> {
    try {
      await this.setTenantContext();
      const { data, error } = await this.supabase
        .from('discussion_topics')
        .select('*')
        .eq('community_id', this.currentCommunityId);
      
      if (error) throw error;
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getTopicById(id: string): Promise<DiscussionTopic> {
    try {
      await this.setTenantContext();
      const { data, error } = await this.supabase
        .from('discussion_topics')
        .select('*')
        .eq('id', id)
        .eq('community_id', this.currentCommunityId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async createTopic(topic: Partial<DiscussionTopic>): Promise<DiscussionTopic> {
    try {
      await this.setTenantContext();
      const { data, error } = await this.supabase
        .from('discussion_topics')
        .insert([{
          ...topic,
          community_id: this.currentCommunityId
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateTopic(id: string, topic: Partial<DiscussionTopic>): Promise<DiscussionTopic> {
    try {
      await this.setTenantContext();
      const { data, error } = await this.supabase
        .from('discussion_topics')
        .update(topic)
        .eq('id', id)
        .eq('community_id', this.currentCommunityId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deleteTopic(id: string): Promise<void> {
    try {
      await this.setTenantContext();
      const { error } = await this.supabase
        .from('discussion_topics')
        .delete()
        .eq('id', id)
        .eq('community_id', this.currentCommunityId);
      
      if (error) throw error;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getDiscussionsByTopic(topicId: string): Promise<Discussion[]> {
    try {
      await this.setTenantContext();
      const { data, error } = await this.supabase
        .from('discussions')
        .select('*, author:profiles(*)')
        .eq('topic_id', topicId)
        .eq('community_id', this.currentCommunityId);
      
      if (error) throw error;
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getDiscussion(id: string): Promise<Discussion> {
    try {
      await this.setTenantContext();
      const { data, error } = await this.supabase
        .from('discussions')
        .select('*, author:profiles(*), replies:discussion_replies(*, author:profiles(*))')
        .eq('id', id)
        .eq('community_id', this.currentCommunityId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async createDiscussion(discussion: Partial<Discussion>): Promise<Discussion> {
    try {
      await this.setTenantContext();
      const { data, error } = await this.supabase
        .from('discussions')
        .insert([{
          ...discussion,
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

  async updateDiscussion(id: string, discussion: Partial<Discussion>): Promise<Discussion> {
    try {
      await this.setTenantContext();
      const { data, error } = await this.supabase
        .from('discussions')
        .update(discussion)
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

  async deleteDiscussion(id: string): Promise<void> {
    try {
      await this.setTenantContext();
      const { error } = await this.supabase
        .from('discussions')
        .delete()
        .eq('id', id)
        .eq('community_id', this.currentCommunityId);
      
      if (error) throw error;
    } catch (error) {
      this.handleError(error);
    }
  }

  async addReply(discussionId: string, reply: Partial<DiscussionReply>): Promise<DiscussionReply> {
    try {
      await this.setTenantContext();
      const { data, error } = await this.supabase
        .from('discussion_replies')
        .insert([{
          ...reply,
          discussion_id: discussionId
        }])
        .select('*, author:profiles(*)')
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateReply(id: string, reply: Partial<DiscussionReply>): Promise<DiscussionReply> {
    try {
      await this.setTenantContext();
      const { data, error } = await this.supabase
        .from('discussion_replies')
        .update(reply)
        .eq('id', id)
        .select('*, author:profiles(*)')
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deleteReply(id: string): Promise<void> {
    try {
      await this.setTenantContext();
      const { error } = await this.supabase
        .from('discussion_replies')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      this.handleError(error);
    }
  }

  async markReplyAsSolution(replyId: string): Promise<DiscussionReply> {
    try {
      await this.setTenantContext();
      
      // First, get the reply to find the discussion ID
      const { data: replyData, error: replyError } = await this.supabase
        .from('discussion_replies')
        .select('discussion_id')
        .eq('id', replyId)
        .single();
      
      if (replyError) throw replyError;
      
      // Reset any existing solutions for this discussion
      const { error: resetError } = await this.supabase
        .from('discussion_replies')
        .update({ is_solution: false })
        .eq('discussion_id', replyData.discussion_id);
      
      if (resetError) throw resetError;
      
      // Mark this reply as the solution
      const { data, error } = await this.supabase
        .from('discussion_replies')
        .update({ is_solution: true })
        .eq('id', replyId)
        .select('*, author:profiles(*)')
        .single();
      
      if (error) throw error;
      
      // Update the discussion to mark it as answered
      await this.supabase
        .from('discussions')
        .update({ is_closed: true })
        .eq('id', replyData.discussion_id);
      
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async incrementViewCount(discussionId: string): Promise<void> {
    try {
      await this.setTenantContext();
      const { error } = await this.supabase
        .rpc('increment_discussion_views', {
          discussion_id_param: discussionId
        });
      
      if (error) throw error;
    } catch (error) {
      this.handleError(error);
    }
  }
}
