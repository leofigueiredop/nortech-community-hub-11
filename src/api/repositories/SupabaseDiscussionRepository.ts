
import { createClient } from '@supabase/supabase-js';
import { IDiscussionRepository } from '../interfaces/IDiscussionRepository';
import { Discussion, DiscussionReply, DiscussionTopic } from '@/types/discussion';
import { BaseRepository } from './BaseRepository';
import { supabaseConfig } from '../ApiClient';

export class SupabaseDiscussionRepository extends BaseRepository implements IDiscussionRepository {
  private supabase;

  constructor() {
    super();
    this.supabase = createClient(
      supabaseConfig.url,
      supabaseConfig.anonKey
    );
  }

  async getAllTopics(): Promise<DiscussionTopic[]> {
    try {
      const { data, error } = await this.supabase
        .from('discussion_topics')
        .select('*');
      
      if (error) throw error;
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getDiscussionsByTopic(topicId: string): Promise<Discussion[]> {
    try {
      const { data, error } = await this.supabase
        .from('discussions')
        .select('*, author:users(*)')
        .eq('topic_id', topicId);
      
      if (error) throw error;
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getDiscussion(id: string): Promise<Discussion> {
    try {
      const { data, error } = await this.supabase
        .from('discussions')
        .select('*, author:users(*), replies:discussion_replies(*)')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async createDiscussion(discussion: Partial<Discussion>): Promise<Discussion> {
    try {
      const { data, error } = await this.supabase
        .from('discussions')
        .insert([discussion])
        .select('*, author:users(*)')
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async addReply(discussionId: string, reply: Partial<DiscussionReply>): Promise<DiscussionReply> {
    try {
      const { data, error } = await this.supabase
        .from('discussion_replies')
        .insert([{ ...reply, discussion_id: discussionId }])
        .select('*, author:users(*)')
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }
}
