import { useState, useEffect, useCallback } from 'react';
import { useApi } from './useApi';
import { Post } from '@/types/post';
import { useAuth } from '@/context/AuthContext';

interface UsePostsOptions {
  page?: number;
  limit?: number;
  featured?: boolean;
  userId?: string;
}

interface UsePostsResult {
  posts: Post[];
  loading: boolean;
  error: string | null;
  totalPosts: number;
  totalPages: number;
  refetch: () => Promise<void>;
  loadMorePosts: () => Promise<void>;
  createPost: (postData: Partial<Post>) => Promise<Post>;
  deletePost: (postId: string) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  unlikePost: (postId: string) => Promise<void>;
  getUserLikeStatus: (postId: string) => Promise<boolean>;
}

export function usePosts({
  page = 1,
  limit = 10,
  featured = false,
  userId,
}: UsePostsOptions = {}): UsePostsResult {
  const { client } = useApi();
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let result;
      if (featured) {
        const featuredPosts = await client.posts.getFeaturedPosts(limit);
        result = { posts: featuredPosts, total: featuredPosts.length };
      } else if (userId) {
        const userPosts = await client.posts.getPostsByUser(userId, limit);
        result = { posts: userPosts, total: userPosts.length };
      } else {
        result = await client.posts.getAll(page, limit);
      }

      setPosts(result.posts);
      setTotalPosts(result.total);
      setTotalPages(Math.ceil(result.total / limit));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  }, [client, page, limit, featured, userId]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const loadMorePosts = async () => {
    if (page < totalPages) {
      try {
        setLoading(true);
        const result = await client.posts.getAll(page + 1, limit);
        setPosts(prevPosts => [...prevPosts, ...result.posts]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load more posts');
      } finally {
        setLoading(false);
      }
    }
  };

  const createPost = async (postData: Partial<Post>): Promise<Post> => {
    try {
      const newPost = await client.posts.create({
        ...postData,
        author_id: user?.id,
      });
      setPosts(prevPosts => [newPost, ...prevPosts]);
      return newPost;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create post';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deletePost = async (postId: string): Promise<void> => {
    try {
      await client.posts.delete(postId);
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete post';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const likePost = async (postId: string): Promise<void> => {
    if (!user) return;
    try {
      await client.posts.addReaction(postId, user.id, 'like');
      // Update local state to reflect the like
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? {
                ...post,
                reactions_count: (post.reactions_count || 0) + 1,
                user_reaction: 'like'
              }
            : post
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to like post');
    }
  };

  const unlikePost = async (postId: string): Promise<void> => {
    if (!user) return;
    try {
      await client.posts.removeReaction(postId, user.id);
      // Update local state to reflect the unlike
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? {
                ...post,
                reactions_count: Math.max((post.reactions_count || 0) - 1, 0),
                user_reaction: null
              }
            : post
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unlike post');
    }
  };

  const getUserLikeStatus = async (postId: string): Promise<boolean> => {
    if (!user) return false;
    try {
      const reaction = await client.posts.getUserReaction(postId, user.id);
      return !!reaction && reaction.reaction_type === 'like';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get reaction status');
      return false;
    }
  };

  return {
    posts,
    loading,
    error,
    totalPosts,
    totalPages,
    refetch: fetchPosts,
    loadMorePosts,
    createPost,
    deletePost,
    likePost,
    unlikePost,
    getUserLikeStatus,
  };
} 