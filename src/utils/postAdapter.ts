import { Post } from '@/types/post';
import { PostProps } from '@/components/post/Post';
import { formatDistanceToNow } from 'date-fns';
import { SPACE_ACCESS, UserTier } from '@/types/subscription';

export function adaptPostToProps(post: Post, isPremium: boolean = false): PostProps {
  const formattedDate = formatRelativeTime(post.created_at);
  const spaceName = post.space_id || 'General Discussion';
  
  // Ensure counts are always numbers
  const likesValue = post.reactions_count;
  const commentsValue = post.comment_count;
  
  return {
    id: post.id,
    author: {
      name: post.author?.name || 'Unknown User',
      avatar: post.author?.avatar_url || '',
      role: getRoleFromPost(post),
    },
    title: post.title || undefined,
    content: post.content,
    createdAt: formattedDate,
    likes: Number(likesValue) || 0,
    comments: Number(commentsValue) || 0,
    space: spaceName,
    spaceTier: getSpaceTier(spaceName),
    type: getPostType(post),
    isPinned: post.pinned || false,
    isAnnouncement: isAnnouncement(post),
    isPaid: post.visibility === 'premium',
    teaser: generateTeaser(post.content),
    tags: post.tags || [],
    accessBadge: getAccessBadge(post, isPremium),
  };
}

function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const distance = formatDistanceToNow(date, { addSuffix: false });
    
    if (isToday(date)) {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const formattedTime = `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
      return `Today at ${formattedTime}`;
    }
    
    return `${distance} ago`;
  } catch (e) {
    return dateString;
  }
}

function isToday(date: Date): boolean {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
}

function getRoleFromPost(post: Post): string | undefined {
  // Add logic to determine role based on author, if available in your system
  // This is just a placeholder implementation
  if (post.author?.id === post.community_id) {
    return 'Admin';
  }
  
  return undefined;
}

function isAnnouncement(post: Post): boolean {
  // Check for announcement metadata or other indicators
  return post.type === 'text' && !!post.is_featured;
}

function getPostType(post: Post): 'post' | 'event' | 'live' | 'content' | undefined {
  // Custom mapping based on post properties
  if (post.type === 'text' || post.type === 'image' || post.type === 'video' || post.type === 'link' || post.type === 'poll') {
    // Check for special post types by examining other properties
    if (post.expires_at) {
      return 'event';
    }
    
    // Check for "live" type posts based on post properties
    // Since 'metadata' isn't in the Post type, we'll use other properties
    if (post.type === 'video' && post.status === 'published') {
      // We can infer live status from other properties if needed
      return 'live';
    }
    
    // For content posts - we might identify based on tags or other indicators
    if (post.tags?.includes('content') || post.tags?.includes('article')) {
      return 'content';
    }
    
    // Default to regular post
    return 'post';
  }
  
  return undefined;
}

function generateTeaser(content: string): string | undefined {
  if (!content) return undefined;
  
  // Create a teaser that's about 20% of the content or 100 characters, whichever is shorter
  const maxLength = Math.min(100, Math.floor(content.length * 0.2));
  
  if (content.length <= maxLength) return undefined;
  
  return content.substring(0, maxLength).trim() + '...';
}

function getAccessBadge(post: Post, isPremium: boolean): 'free' | 'premium' | 'unlocked' {
  if (post.visibility === 'premium') {
    if (isPremium) {
      return 'unlocked';
    }
    return 'premium';
  }
  
  return 'free';
}

function getSpaceTier(spaceName: string): UserTier {
  const spaceAccess = SPACE_ACCESS[spaceName];
  return spaceAccess?.requiredTier || 'free';
} 