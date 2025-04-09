
import { PostProps } from '@/components/post/Post';

// Filter posts based on content type
export const filterByContentType = (posts: PostProps[], contentFilter: string): PostProps[] => {
  if (contentFilter === 'all') return posts;
  
  return posts.filter(post => {
    if (contentFilter === 'posts' && post.type && post.type !== 'post') return false;
    if (contentFilter === 'events' && post.type !== 'event') return false;
    if (contentFilter === 'lives' && post.type !== 'live') return false;
    if (contentFilter === 'content' && post.type !== 'content') return false;
    return true;
  });
};

// Filter posts based on access level
export const filterByAccessLevel = (posts: PostProps[], accessFilter: string): PostProps[] => {
  if (accessFilter === 'all') return posts;
  
  return posts.filter(post => {
    if (accessFilter === 'free' && post.isPaid) return false;
    if (accessFilter === 'paid' && !post.isPaid) return false;
    if (accessFilter === 'subscription' && !post.isPaid) return false;
    return true;
  });
};

// Filter posts based on selected tags
export const filterByTags = (posts: PostProps[], selectedTags: string[]): PostProps[] => {
  if (selectedTags.length === 0) return posts;
  
  return posts.filter(post => {
    if (!post.tags) return false;
    return post.tags.some(tag => selectedTags.includes(tag));
  });
};

// Filter posts based on search query
export const filterBySearchQuery = (posts: PostProps[], searchQuery: string): PostProps[] => {
  if (!searchQuery) return posts;
  
  const query = searchQuery.toLowerCase();
  return posts.filter(post => {
    const titleMatch = post.title?.toLowerCase().includes(query);
    const contentMatch = post.content.toLowerCase().includes(query);
    const tagMatch = post.tags?.some(tag => tag.toLowerCase().includes(query));
    const authorMatch = post.author.name.toLowerCase().includes(query);
    
    return titleMatch || contentMatch || tagMatch || authorMatch;
  });
};

// Filter posts based on space
export const filterBySpace = (posts: PostProps[], activeSpace: string): PostProps[] => {
  if (activeSpace === 'all') return posts;
  
  return posts.filter(post => post.space.toLowerCase() === activeSpace);
};

// Sort posts (pinned first)
export const sortPosts = (posts: PostProps[]): PostProps[] => {
  return [...posts].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });
};
