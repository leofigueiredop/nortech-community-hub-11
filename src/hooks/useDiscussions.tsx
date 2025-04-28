
import { useState, useEffect, useCallback } from 'react';
import { DiscussionTopic, Discussion, DiscussionReply, DiscussionFilter } from '@/types/discussion';
import { SupabaseDiscussionsRepository } from '@/api/repositories/SupabaseDiscussionsRepository';

interface ActiveUser {
  user: {
    id: string;
    name: string;
    avatar?: string;
    level?: number;
    xp?: number;
  };
  count: number;
}

export const useDiscussions = () => {
  const [loading, setLoading] = useState(false);
  const [topics, setTopics] = useState<DiscussionTopic[]>([]);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  
  // Initialize repository
  const repository = new SupabaseDiscussionsRepository();

  useEffect(() => {
    // Load initial data
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    setLoading(true);
    try {
      const fetchedTopics = await repository.getTopics();
      setTopics(fetchedTopics);
    } catch (error) {
      console.error('Error fetching topics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDiscussions = async (topicId?: string) => {
    setLoading(true);
    try {
      const fetchedDiscussions = await repository.getDiscussions(topicId);
      setDiscussions(fetchedDiscussions);
    } catch (error) {
      console.error('Error fetching discussions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveUsers = async () => {
    try {
      const users = await repository.getActiveUsers();
      setActiveUsers(users);
    } catch (error) {
      console.error('Error fetching active users:', error);
    }
  };

  const createTopic = async (topicData: Partial<DiscussionTopic>) => {
    setLoading(true);
    try {
      if (!topicData.title) {
        throw new Error("Topic title is required");
      }
      
      const newTopic = await repository.createTopic({
        community_id: topicData.community_id || 'default',
        title: topicData.title,
        description: topicData.description,
        icon: topicData.icon,
        color: topicData.color,
        slug: topicData.slug,
        is_featured: topicData.is_featured || false,
        is_private: topicData.is_private || false,
        access_level: topicData.access_level || 'free'
      });
      
      setTopics(prev => [...prev, newTopic]);
      return newTopic;
    } catch (error) {
      console.error('Error creating topic:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createDiscussion = async (discussionData: Partial<Discussion>) => {
    setLoading(true);
    try {
      if (!discussionData.title || !discussionData.content || !discussionData.topic_id) {
        throw new Error("Title, content, and topic_id are required");
      }
      
      const newDiscussion = await repository.createDiscussion({
        community_id: discussionData.community_id || 'default',
        topic_id: discussionData.topic_id,
        user_id: discussionData.user_id || 'anonymous',
        title: discussionData.title,
        content: discussionData.content,
        format: discussionData.format || 'discussion',
        is_locked: discussionData.is_locked || false,
        is_featured: discussionData.is_featured || false,
        is_anonymous: discussionData.is_anonymous || false,
        tags: discussionData.tags || [],
        votes: 0,
        view_count: 0
      });
      
      setDiscussions(prev => [newDiscussion, ...prev]);
      return newDiscussion;
    } catch (error) {
      console.error('Error creating discussion:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for UI components that expect the old API
  const getAllTopics = useCallback(() => {
    return topics;
  }, [topics]);
  
  const getTopic = useCallback((id: string) => {
    return topics.find(topic => topic.id === id) || null;
  }, [topics]);
  
  const getDiscussions = useCallback((topicId: string) => {
    return discussions.filter(discussion => discussion.topic_id === topicId);
  }, [discussions]);
  
  const filterDiscussions = useCallback((filters: DiscussionFilter[]) => {
    return discussions.filter(discussion => {
      return filters.every(filter => {
        switch (filter.type) {
          case 'topic':
            return discussion.topic_id === filter.value;
          case 'format':
            return discussion.format === filter.value;
          case 'tag':
            return discussion.tags.includes(filter.value);
          case 'status':
            if (filter.value === 'hot') return discussion.isHot;
            if (filter.value === 'answered') return discussion.isAnswered;
            if (filter.value === 'unanswered') return !discussion.isAnswered;
            return true;
          default:
            return true;
        }
      });
    });
  }, [discussions]);
  
  const getActiveUsers = useCallback(() => {
    if (activeUsers.length === 0) {
      fetchActiveUsers();
    }
    return activeUsers;
  }, [activeUsers]);

  return {
    loading,
    topics,
    discussions,
    fetchTopics,
    fetchDiscussions,
    createTopic,
    createDiscussion,
    // Compatibility with old code
    getAllTopics,
    getTopic,
    getDiscussions,
    filterDiscussions,
    getActiveUsers
  };
};
