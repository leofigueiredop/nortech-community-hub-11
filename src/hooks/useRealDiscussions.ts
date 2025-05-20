import { useState, useCallback, useEffect } from 'react';
import { api } from '@/api/ApiClient';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { 
  Discussion, 
  DiscussionTopic, 
  DiscussionReply,
  DiscussionFilter 
} from '@/types/discussion';

export const useRealDiscussions = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [topics, setTopics] = useState<DiscussionTopic[]>([]);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [currentTopic, setCurrentTopic] = useState<DiscussionTopic | null>(null);
  const [currentDiscussion, setCurrentDiscussion] = useState<Discussion | null>(null);
  const { user, community } = useAuth();
  const { toast } = useToast();

  // Load topics on component mount
  useEffect(() => {
    loadTopics();
  }, []);

  // Load all topics from the API
  const loadTopics = useCallback(async () => {
    setLoading(true);
    try {
      const topicsData = await api.discussions.getAllTopics();
      setTopics(topicsData);
    } catch (error) {
      console.error('Error loading topics:', error);
      toast({
        title: 'Error',
        description: 'Failed to load discussion topics',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Load discussions for a specific topic
  const loadDiscussionsByTopic = useCallback(async (topicId: string) => {
    setLoading(true);
    try {
      const [topicData, discussionsData] = await Promise.all([
        api.discussions.getTopicById(topicId),
        api.discussions.getDiscussionsByTopic(topicId)
      ]);
      
      setCurrentTopic(topicData);
      setDiscussions(discussionsData);
    } catch (error) {
      console.error('Error loading discussions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load discussions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Load a specific discussion with its replies
  const loadDiscussion = useCallback(async (discussionId: string) => {
    setLoading(true);
    try {
      const discussionData = await api.discussions.getDiscussion(discussionId);
      setCurrentDiscussion(discussionData);
      
      // Increment view count
      await api.discussions.incrementViewCount(discussionId);
    } catch (error) {
      console.error('Error loading discussion:', error);
      toast({
        title: 'Error',
        description: 'Failed to load discussion',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Create a new topic
  const createTopic = useCallback(async (topicData: Partial<DiscussionTopic>) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to create a topic',
        variant: 'destructive',
      });
      return null;
    }

    setLoading(true);
    try {
      const newTopic = await api.discussions.createTopic({
        ...topicData,
        community_id: community?.id
      });
      
      setTopics(prev => [...prev, newTopic]);
      return newTopic;
    } catch (error) {
      console.error('Error creating topic:', error);
      toast({
        title: 'Error',
        description: 'Failed to create topic',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, community, toast]);

  // Create a new discussion
  const createDiscussion = useCallback(async (discussionData: Partial<Discussion>) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to create a discussion',
        variant: 'destructive',
      });
      return null;
    }

    setLoading(true);
    try {
      const newDiscussion = await api.discussions.createDiscussion({
        ...discussionData,
        user_id: user.id,
        community_id: community?.id
      });
      
      setDiscussions(prev => [newDiscussion, ...prev]);
      return newDiscussion;
    } catch (error) {
      console.error('Error creating discussion:', error);
      toast({
        title: 'Error',
        description: 'Failed to create discussion',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, community, toast]);

  // Add a reply to a discussion
  const addReply = useCallback(async (discussionId: string, replyData: Partial<DiscussionReply>) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to reply',
        variant: 'destructive',
      });
      return null;
    }

    setLoading(true);
    try {
      const newReply = await api.discussions.addReply(discussionId, {
        ...replyData,
        user_id: user.id
      });
      
      // Update current discussion if it's loaded
      if (currentDiscussion && currentDiscussion.id === discussionId) {
        setCurrentDiscussion(prev => {
          if (!prev) return null;
          
          // Handle both array and number for replies
          const currentReplies = Array.isArray(prev.replies) 
            ? prev.replies as DiscussionReply[]
            : [];
            
          return {
            ...prev,
            replies: [...currentReplies, newReply],
            // Increment replies count if it's a number
            ...(typeof prev.replies === 'number' ? { replies: (prev.replies as number) + 1 } : {})
          };
        });
      }
      
      return newReply;
    } catch (error) {
      console.error('Error adding reply:', error);
      toast({
        title: 'Error',
        description: 'Failed to add reply',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, currentDiscussion, toast]);

  // Mark a reply as the solution
  const markReplyAsSolution = useCallback(async (replyId: string) => {
    setLoading(true);
    try {
      const updatedReply = await api.discussions.markReplyAsSolution(replyId);
      
      // Update current discussion if it's loaded
      if (currentDiscussion) {
        setCurrentDiscussion(prev => {
          if (!prev || !Array.isArray(prev.replies)) return prev;
          
          const updatedReplies = (prev.replies as DiscussionReply[]).map(reply => 
            reply.id === replyId 
              ? { ...reply, is_solution: true }
              : { ...reply, is_solution: false }
          );
          
          return {
            ...prev,
            isAnswered: true,
            replies: updatedReplies as typeof prev.replies
          };
        });
      }
      
      return updatedReply;
    } catch (error) {
      console.error('Error marking solution:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark reply as solution',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentDiscussion, toast]);

  // Upvote a discussion
  const upvoteDiscussion = useCallback(async (discussionId: string, isUpvoted: boolean) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to upvote discussions',
        variant: 'destructive',
      });
      return false;
    }

    try {
      const success = await api.discussions.upvoteDiscussion(discussionId, isUpvoted);
      
      if (success) {
        // Update local state to reflect the upvote
        // First check if this is the current discussion
        if (currentDiscussion && currentDiscussion.id === discussionId) {
          setCurrentDiscussion(prev => {
            if (!prev) return null;
            return {
              ...prev,
              upvotes: (prev.upvotes || 0) + (isUpvoted ? 1 : -1)
            };
          });
        }
        
        // Then update it in the discussions list if it exists there
        setDiscussions(prev => 
          prev.map(discussion => 
            discussion.id === discussionId 
              ? { 
                  ...discussion, 
                  upvotes: (discussion.upvotes || 0) + (isUpvoted ? 1 : -1)
                }
              : discussion
          )
        );
      }
      
      return success;
    } catch (error) {
      console.error('Error upvoting discussion:', error);
      toast({
        title: 'Error',
        description: 'Failed to update vote',
        variant: 'destructive',
      });
      return false;
    }
  }, [user, currentDiscussion, toast]);

  // Check if the current user has upvoted a discussion
  const checkUpvoted = useCallback(async (discussionId: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      return api.discussions.checkUserUpvoted(discussionId, user.id);
    } catch (error) {
      console.error('Error checking upvote status:', error);
      return false;
    }
  }, [user]);

  // Filter discussions based on criteria
  const filterDiscussions = useCallback((filters: DiscussionFilter[]) => {
    return discussions.filter(discussion => {
      return filters.every(filter => {
        switch (filter.type) {
          case 'topic':
            return discussion.topic_id === filter.value;
          case 'format':
            return discussion.format === filter.value;
          case 'tag':
            return discussion.tags?.includes(filter.value);
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

  // Getter methods for compatibility with existing components
  const getAllTopics = useCallback(() => topics, [topics]);
  const getTopic = useCallback((id: string) => topics.find(t => t.id === id) || null, [topics]);
  const getDiscussions = useCallback((topicId: string) => 
    discussions.filter(d => d.topic_id === topicId), [discussions]);
  const getDiscussion = useCallback((id: string) => 
    discussions.find(d => d.id === id) || currentDiscussion, [discussions, currentDiscussion]);

  return {
    loading,
    topics,
    discussions,
    currentTopic,
    currentDiscussion,
    loadTopics,
    loadDiscussionsByTopic,
    loadDiscussion,
    createTopic,
    createDiscussion,
    addReply,
    markReplyAsSolution,
    upvoteDiscussion,
    checkUpvoted,
    filterDiscussions,
    // Compatibility getters
    getAllTopics,
    getTopic,
    getDiscussions,
    getDiscussion
  };
}; 