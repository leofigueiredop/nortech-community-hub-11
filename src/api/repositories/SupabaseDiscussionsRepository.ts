
import { createClient } from '@/api/supabase';
import { Discussion, DiscussionReply, DiscussionTopic, DiscussionVote } from '@/types/discussion';

export interface IDiscussionsRepository {
  getTopics(): Promise<DiscussionTopic[]>;
  getTopic(id: string): Promise<DiscussionTopic | null>;
  getDiscussions(topicId?: string): Promise<Discussion[]>;
  getDiscussion(id: string): Promise<Discussion | null>;
  createTopic(topic: Omit<DiscussionTopic, 'id' | 'created_at' | 'updated_at' | 'discussionCount' | 'memberCount' | 'recentActivity'>): Promise<DiscussionTopic>;
  createDiscussion(discussion: Omit<Discussion, 'id' | 'created_at' | 'updated_at'>): Promise<Discussion>;
  getActiveUsers(): Promise<{ user: any, count: number }[]>;
}

export class SupabaseDiscussionsRepository implements IDiscussionsRepository {
  private supabase = createClient();

  async getTopics(): Promise<DiscussionTopic[]> {
    try {
      const { data: topicsData, error: topicsError } = await this.supabase
        .from('discussion_topics')
        .select('*')
        .order('created_at', { ascending: false });

      if (topicsError) throw topicsError;

      // Get discussion counts per topic - modified to avoid using .group()
      const { data: discussions, error: discussionsError } = await this.supabase
        .from('discussions')
        .select('topic_id')
        .eq('is_deleted', false);

      if (discussionsError) throw discussionsError;
      
      // Calculate counts manually
      const topicCounts: Record<string, number> = {};
      discussions.forEach(disc => {
        topicCounts[disc.topic_id] = (topicCounts[disc.topic_id] || 0) + 1;
      });

      // Get most recent activity timestamps per topic
      const { data: activityData, error: activityError } = await this.supabase
        .from('discussions')
        .select('topic_id, updated_at')
        .order('updated_at', { ascending: false });

      if (activityError) throw activityError;

      const topicActivity = activityData.reduce((acc: Record<string, string>, item: any) => {
        if (!acc[item.topic_id] || new Date(item.updated_at) > new Date(acc[item.topic_id])) {
          acc[item.topic_id] = item.updated_at;
        }
        return acc;
      }, {});

      return topicsData.map((topic: any) => ({
        ...topic,
        discussionCount: topicCounts[topic.id] || 0,
        memberCount: 0, // This would need to be calculated differently
        recentActivity: topicActivity[topic.id] || topic.updated_at,
        // For compatibility with UI components
        name: topic.title
      }));
    } catch (error) {
      console.error('Error fetching discussion topics:', error);
      return [];
    }
  }

  async getTopic(id: string): Promise<DiscussionTopic | null> {
    try {
      const { data, error } = await this.supabase
        .from('discussion_topics')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      // Get discussion count for this topic
      const { data: countData, error: countError } = await this.supabase
        .from('discussions')
        .select('*')
        .eq('topic_id', id)
        .eq('is_deleted', false);

      if (countError) throw countError;
      
      return {
        ...data,
        discussionCount: countData.length,
        memberCount: 0, // This would need a different calculation
        recentActivity: data.updated_at,
        // For compatibility with UI components
        name: data.title
      };
    } catch (error) {
      console.error(`Error fetching topic ${id}:`, error);
      return null;
    }
  }

  async getDiscussions(topicId?: string): Promise<Discussion[]> {
    try {
      let query = this.supabase
        .from('discussions')
        .select(`
          *,
          author:user_id (id, name, avatar_url),
          replies:discussion_replies (*)
        `)
        .eq('is_deleted', false);

      if (topicId) {
        query = query.eq('topic_id', topicId);
      }

      const { data, error } = await query
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map((discussion: any) => ({
        ...discussion,
        votes: discussion.upvotes_count - discussion.downvotes_count,
        lastActivity: this.formatRelativeTime(discussion.updated_at),
        // Add these properties for compatibility with UI components
        isHot: discussion.upvotes_count > 10,
        isAnswered: discussion.replies && discussion.replies.some((reply: any) => reply.is_solution)
      }));
    } catch (error) {
      console.error('Error fetching discussions:', error);
      return [];
    }
  }

  async getDiscussion(id: string): Promise<Discussion | null> {
    try {
      const { data, error } = await this.supabase
        .from('discussions')
        .select(`
          *,
          author:user_id (id, name, avatar_url),
          replies:discussion_replies (
            *,
            author:user_id (id, name, avatar_url)
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      return {
        ...data,
        votes: data.upvotes_count - data.downvotes_count,
        lastActivity: this.formatRelativeTime(data.updated_at),
        // Add these properties for compatibility with UI components
        isHot: data.upvotes_count > 10,
        isAnswered: data.replies && data.replies.some((reply: any) => reply.is_solution)
      };
    } catch (error) {
      console.error(`Error fetching discussion ${id}:`, error);
      return null;
    }
  }

  async createTopic(topic: Omit<DiscussionTopic, 'id' | 'created_at' | 'updated_at' | 'discussionCount' | 'memberCount' | 'recentActivity'>): Promise<DiscussionTopic> {
    try {
      const newTopic = {
        community_id: topic.community_id,
        title: topic.title,
        description: topic.description || '',
        icon: topic.icon,
        color: topic.color,
        slug: topic.slug || this.createSlug(topic.title),
        is_featured: topic.is_featured || false,
        is_private: topic.is_private || false,
        access_level: topic.access_level || 'free',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await this.supabase
        .from('discussion_topics')
        .insert(newTopic)
        .select()
        .single();

      if (error) throw error;

      return {
        ...data,
        discussionCount: 0,
        memberCount: 0,
        recentActivity: data.updated_at,
        // For compatibility with UI components
        name: data.title
      };
    } catch (error) {
      console.error('Error creating topic:', error);
      throw error;
    }
  }

  async createDiscussion(discussion: Omit<Discussion, 'id' | 'created_at' | 'updated_at'>): Promise<Discussion> {
    try {
      const newDiscussion = {
        community_id: discussion.community_id,
        topic_id: discussion.topic_id,
        user_id: discussion.user_id,
        title: discussion.title,
        content: discussion.content,
        format: discussion.format || 'discussion',
        is_locked: discussion.is_locked || false,
        is_featured: discussion.is_featured || false,
        is_anonymous: discussion.is_anonymous || false,
        tags: discussion.tags || [],
        is_deleted: false,
        upvotes_count: 0,
        downvotes_count: 0,
        view_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await this.supabase
        .from('discussions')
        .insert(newDiscussion)
        .select(`
          *,
          author:user_id (id, name, avatar_url)
        `)
        .single();

      if (error) throw error;

      return {
        ...data,
        votes: 0,
        replies: [],
        lastActivity: this.formatRelativeTime(data.updated_at),
        // Add these properties for compatibility with UI components
        isHot: false,
        isAnswered: false
      };
    } catch (error) {
      console.error('Error creating discussion:', error);
      throw error;
    }
  }

  async getActiveUsers(): Promise<{ user: any; count: number; }[]> {
    try {
      // Modified to avoid using .group()
      const { data: discussions, error } = await this.supabase
        .from('discussions')
        .select('user_id')
        .eq('is_deleted', false);

      if (error) throw error;

      // Count user posts manually
      const userPostCounts: Record<string, number> = {};
      discussions.forEach((item: any) => {
        userPostCounts[item.user_id] = (userPostCounts[item.user_id] || 0) + 1;
      });

      // Convert to array and sort
      const sortedUsers = Object.entries(userPostCounts)
        .map(([userId, count]) => ({ userId, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Get user details
      const userIds = sortedUsers.map((item) => item.userId);
      const { data: users, error: usersError } = await this.supabase
        .from('users')
        .select('id, name, avatar_url, level, xp')
        .in('id', userIds);

      if (usersError) throw usersError;

      const userMap: Record<string, any> = {};
      users.forEach((user: any) => {
        userMap[user.id] = user;
      });

      return sortedUsers.map((item) => ({
        user: {
          id: item.userId,
          name: userMap[item.userId]?.name || 'Unknown User',
          avatar: userMap[item.userId]?.avatar_url,
          level: userMap[item.userId]?.level || 1,
          xp: userMap[item.userId]?.xp || 0
        },
        count: item.count
      }));
    } catch (error) {
      console.error('Error fetching active users:', error);
      return [];
    }
  }

  // Helper methods
  private createSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '-');
  }

  private formatRelativeTime(timestamp: string): string {
    try {
      const now = new Date();
      const date = new Date(timestamp);
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
      
      if (diffInSeconds < 60) {
        return 'agora mesmo';
      } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} minuto${minutes > 1 ? 's' : ''} atrás`;
      } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} hora${hours > 1 ? 's' : ''} atrás`;
      } else if (diffInSeconds < 604800) {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} dia${days > 1 ? 's' : ''} atrás`;
      } else if (diffInSeconds < 2592000) {
        const weeks = Math.floor(diffInSeconds / 604800);
        return `${weeks} semana${weeks > 1 ? 's' : ''} atrás`;
      } else {
        const months = Math.floor(diffInSeconds / 2592000);
        return `${months} mês${months > 1 ? 'es' : ''} atrás`;
      }
    } catch (e) {
      console.error('Error formatting relative time:', e);
      return timestamp;
    }
  }
}
