
import { useState, useEffect } from 'react';
import { DiscussionTopic, Discussion, DiscussionReply, DiscussionVote } from '@/types/discussion';
import { api } from '@/api/ApiClient';

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

  useEffect(() => {
    // Load initial data
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would fetch from the API
      // const response = await api.discussions.getTopics();
      // setTopics(response);

      // For now, use mock data
      setTopics([
        {
          id: 'topic-1',
          community_id: 'comm-1',
          title: 'General Discussion',
          description: 'Talk about anything related to our community',
          icon: 'MessageSquare',
          color: 'blue',
          is_featured: true,
          is_private: false,
          access_level: 'free',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          discussionCount: 24,
          memberCount: 156,
          recentActivity: new Date().toISOString()
        },
        {
          id: 'topic-2',
          community_id: 'comm-1',
          title: 'Feature Requests',
          description: 'Suggest new features for our platform',
          icon: 'Lightbulb',
          color: 'amber',
          is_featured: false,
          is_private: false,
          access_level: 'free',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          discussionCount: 15,
          memberCount: 89,
          recentActivity: new Date(Date.now() - 86400000).toISOString()
        },
      ]);
    } catch (error) {
      console.error('Error fetching topics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDiscussions = async (topicId?: string) => {
    setLoading(true);
    try {
      // In a real implementation, this would fetch from the API
      // const response = await api.discussions.getDiscussions({ topicId });
      // setDiscussions(response);

      // For now, use mock data
      setDiscussions([
        {
          id: 'disc-1',
          community_id: 'comm-1',
          topic_id: topicId || 'topic-1',
          user_id: 'user-1',
          title: 'Welcome to our community!',
          content: 'This is a welcome post for all new members.',
          format: 'discussion',
          is_locked: false,
          is_featured: true,
          is_anonymous: false,
          votes: 12,
          view_count: 89,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          author: {
            id: 'user-1',
            name: 'John Admin',
            avatar_url: 'https://ui-avatars.com/api/?name=John+Admin',
            level: 5,
            xp: 2500
          },
          replies: []
        },
        {
          id: 'disc-2',
          community_id: 'comm-1',
          topic_id: topicId || 'topic-1',
          user_id: 'user-2',
          title: 'How do I get started with the platform?',
          content: 'I just joined and I am not sure where to begin...',
          format: 'question',
          is_locked: false,
          is_featured: false,
          is_anonymous: false,
          votes: 3,
          view_count: 42,
          created_at: new Date(Date.now() - 86400000).toISOString(),
          updated_at: new Date(Date.now() - 86400000).toISOString(),
          author: {
            id: 'user-2',
            name: 'New Member',
            avatar_url: 'https://ui-avatars.com/api/?name=New+Member',
            level: 1,
            xp: 150
          },
          replies: []
        },
      ]);
    } catch (error) {
      console.error('Error fetching discussions:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTopic = async (topicData: Partial<DiscussionTopic>): Promise<DiscussionTopic> => {
    setLoading(true);
    try {
      // In a real implementation, this would call the API
      // const response = await api.discussions.createTopic(topicData);
      
      // For now, create a mock response
      const newTopic: DiscussionTopic = {
        id: `topic-${Date.now()}`,
        community_id: topicData.community_id || 'comm-1',
        title: topicData.title || 'New Topic',
        description: topicData.description,
        icon: topicData.icon,
        color: topicData.color,
        is_featured: topicData.is_featured || false,
        is_private: topicData.is_private || false,
        access_level: topicData.access_level || 'free',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        discussionCount: 0,
        memberCount: 1,
        recentActivity: new Date().toISOString()
      };
      
      setTopics(prev => [...prev, newTopic]);
      return newTopic;
    } catch (error) {
      console.error('Error creating topic:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createDiscussion = async (discussionData: Partial<Discussion>): Promise<Discussion> => {
    setLoading(true);
    try {
      // In a real implementation, this would call the API
      // const response = await api.discussions.createDiscussion(discussionData);
      
      // For now, create a mock response
      const newDiscussion: Discussion = {
        id: `disc-${Date.now()}`,
        community_id: discussionData.community_id || 'comm-1',
        topic_id: discussionData.topic_id || 'topic-1',
        user_id: discussionData.user_id || 'user-1',
        title: discussionData.title || 'New Discussion',
        content: discussionData.content || '',
        format: discussionData.format || 'discussion',
        is_locked: discussionData.is_locked || false,
        is_featured: discussionData.is_featured || false,
        is_anonymous: discussionData.is_anonymous || false,
        tags: discussionData.tags || [],
        votes: 0,
        view_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        author: discussionData.author || {
          id: 'user-1',
          name: 'Current User',
          avatar_url: 'https://ui-avatars.com/api/?name=Current+User'
        },
        replies: []
      };
      
      setDiscussions(prev => [...prev, newDiscussion]);
      return newDiscussion;
    } catch (error) {
      console.error('Error creating discussion:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getActiveUsers = (): ActiveUser[] => {
    // In a real implementation, this would fetch from the API
    // return await api.discussions.getActiveUsers();
    
    // For now, return mock data
    return [
      {
        user: {
          id: 'user-1',
          name: 'John Admin',
          avatar: 'https://ui-avatars.com/api/?name=John+Admin',
          level: 5,
          xp: 2500
        },
        count: 42
      },
      {
        user: {
          id: 'user-2',
          name: 'Content Creator',
          avatar: 'https://ui-avatars.com/api/?name=Content+Creator',
          level: 4,
          xp: 1800
        },
        count: 37
      },
      {
        user: {
          id: 'user-3',
          name: 'Super Helper',
          avatar: 'https://ui-avatars.com/api/?name=Super+Helper',
          level: 3,
          xp: 1250
        },
        count: 29
      },
      {
        user: {
          id: 'user-4',
          name: 'Regular Member',
          avatar: 'https://ui-avatars.com/api/?name=Regular+Member',
          level: 2,
          xp: 780
        },
        count: 15
      }
    ];
  };

  return {
    loading,
    topics,
    discussions,
    fetchTopics,
    fetchDiscussions,
    createTopic,
    createDiscussion,
    getActiveUsers
  };
};
