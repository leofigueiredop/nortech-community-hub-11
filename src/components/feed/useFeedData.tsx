import React, { useState, useEffect, useMemo } from 'react';
import { PostProps } from '@/components/post/Post';
import { useFilterState } from './hooks/useFilterState';
import { usePagination } from './hooks/usePagination';
import {
  filterByContentType,
  filterByAccessLevel,
  filterByTags,
  filterBySearchQuery,
  filterBySpace,
  sortPosts
} from './utils/feedFilterUtils';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { usePosts } from '@/hooks/usePosts';
import { adaptPostToProps } from '@/utils/postAdapter';
import { spaceOptions } from './utils/feedConstants';
import { useAuth } from '@/context/AuthContext';
import { shouldBlurContent } from '@/types/subscription';

// Helper function to generate teaser from content
const generateTeaserFromContent = (content: string): string => {
  if (!content) return "This is premium content. Subscribe to see the full post.";
  
  const maxLength = Math.min(100, Math.floor(content.length * 0.3));
  if (content.length <= maxLength) return content;
  
  return content.substring(0, maxLength).trim() + '...';
};

function useFeedData(postsPerPage: number = 5, initialSegment: string = 'all') {
  const [currentView, setCurrentView] = useState('all');
  const [filterState, filterActions] = useFilterState(initialSegment);
  const [hasSeenUpgradePrompt, setHasSeenUpgradePrompt] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Get posts from Supabase using our new hook
  const { posts: dbPosts, loading, error, totalPosts } = usePosts({
    page: 1,
    limit: 50 // We'll handle pagination client-side after filtering
  });
  
  // Check if the user has a premium subscription
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  
  useEffect(() => {
    // For demo purposes, we'll use the user's tier from the auth context
    const userTier = user?.tier || 'free';
    setIsPremiumUser(userTier === 'premium' || userTier === 'mentor');
  }, [user]);
  
  useEffect(() => {
    const premiumInteractions = parseInt(localStorage.getItem('premiumInteractions') || '0');
    
    if (premiumInteractions >= 5 && !hasSeenUpgradePrompt && initialSegment === 'free') {
      toast({
        title: "Upgrade to Premium",
        description: "You seem to enjoy our premium content. Unlock full access with a premium subscription!",
        action: (
          <Button 
            onClick={() => window.location.href = '/settings/subscriptions'} 
            variant="default" 
            className="bg-purple-600 hover:bg-purple-700"
          >
            Learn More
          </Button>
        ),
        duration: 8000,
      });
      setHasSeenUpgradePrompt(true);
    }
  }, [initialSegment, hasSeenUpgradePrompt, toast]);
  
  // Convert DB posts to PostProps format and filter by segment
  const allPosts: PostProps[] = useMemo(() => {
    console.log('🔄 Recalculating posts for segment:', initialSegment, 'user tier:', user?.tier);
    console.log('🔍 Raw dbPosts count:', dbPosts?.length || 0);
    
    if (!dbPosts || dbPosts.length === 0) {
      console.log('❌ No dbPosts available');
      return [];
    }
    
    const posts = dbPosts.map(post => {
      const adapted = adaptPostToProps(post, isPremiumUser);
      console.log(`📄 Post ${adapted.id}: tier=${adapted.tier}, visibility=${post.visibility}, tags=${post.tags?.join(',')}`);
      return adapted;
    });
    console.log('📝 Total posts adapted:', posts.length);
    
    // Always log the tier distribution
    const tierCounts = {
      free: posts.filter(p => p.tier === 'free').length,
      premium: posts.filter(p => p.tier === 'premium').length,
      mentor: posts.filter(p => p.tier === 'mentor').length
    };
    console.log('📊 Tier distribution:', tierCounts);
    
    // Filter posts based on segment
    if (initialSegment === 'free') {
      // Free tab: only show free tier posts
      const filtered = posts.filter(post => post.tier === 'free');
      console.log('🆓 Free posts filtered:', filtered.length);
      return filtered;
    } else if (initialSegment === 'premium') {
      // Premium tab: only show premium tier posts
      const filtered = posts.filter(post => post.tier === 'premium');
      console.log('💎 Premium posts filtered:', filtered.length);
      return filtered;
    } else if (initialSegment === 'mentor') {
      // Mentor tab: only show mentor tier posts
      const filtered = posts.filter(post => post.tier === 'mentor');
      console.log('👨‍🏫 Mentor posts filtered:', filtered.length);
      return filtered;
    } else if (initialSegment === 'all') {
      // All tab: show all posts, but mark higher tier posts for blurring
      const processedPosts = posts.map(post => {
        const userTier = user?.tier || 'free';
        const postTier = post.tier || 'free';
        
        // If user doesn't have access to this tier, mark it for blurring
        if (shouldBlurContent(postTier as any, userTier as any)) {
          console.log(`🔒 Post ${post.id} (${postTier}) will be blurred for user tier: ${userTier}`);
          return {
            ...post,
            accessBadge: postTier as 'premium' | 'free',
            showAccessBadge: true,
            isPaid: true, // This will trigger the blur logic in Post component
            teaser: post.teaser || generateTeaserFromContent(post.content)
          };
        }
        
        console.log(`🔓 Post ${post.id} (${postTier}) accessible for user tier: ${userTier}`);
        return post;
      });
      console.log('🌐 All posts processed:', processedPosts.length);
      return processedPosts;
    }
    
    return posts;
  }, [dbPosts, isPremiumUser, initialSegment, user?.tier]);
  
  const applyFilters = () => {
    let filteredPosts = [...allPosts];
    
    filteredPosts = filterBySpace(filteredPosts, filterState.activeSpace);
    filteredPosts = filterByContentType(filteredPosts, filterState.contentFilter);
    filteredPosts = filterByAccessLevel(filteredPosts, filterState.accessFilter);
    filteredPosts = filterByTags(filteredPosts, filterState.selectedTags);
    filteredPosts = filterBySearchQuery(filteredPosts, filterState.searchQuery);
    
    return sortPosts(filteredPosts);
  };
  
  const sortedFilteredPosts = applyFilters();
  
  const { 
    currentPage, 
    setCurrentPage, 
    totalPages, 
    paginatedItems 
  } = usePagination(
    sortedFilteredPosts.length, 
    postsPerPage, 
    [
      filterState.searchQuery, 
      filterState.contentFilter, 
      filterState.accessFilter, 
      filterState.selectedTags, 
      filterState.activeSpace,
      initialSegment, // Add segment to dependencies
      user?.tier // Add user tier to force updates when tier changes
    ]
  );
  
  const currentPosts = paginatedItems(sortedFilteredPosts);
  
  const hasFilters = filterState.searchQuery !== '' || 
                     filterState.contentFilter !== 'all' || 
                     filterState.accessFilter !== 'all' || 
                     filterState.selectedTags.length > 0 ||
                     filterState.activeSpace !== 'all';

  return {
    currentView,
    setCurrentView,
    searchQuery: filterState.searchQuery,
    setSearchQuery: filterActions.setSearchQuery,
    contentFilter: filterState.contentFilter,
    setContentFilter: filterActions.setContentFilter,
    accessFilter: filterState.accessFilter,
    setAccessFilter: filterActions.setAccessFilter,
    selectedTags: filterState.selectedTags,
    setSelectedTags: filterActions.setSelectedTags,
    activeSpace: filterState.activeSpace,
    setActiveSpace: filterActions.setActiveSpace,
    currentPage,
    setCurrentPage,
    spaceOptions,
    filteredPosts: currentPosts,
    totalPages,
    hasFilters,
    clearAllFilters: filterActions.clearAllFilters,
    loading,
    error,
    isPremiumUser
  };
}

export default useFeedData;
