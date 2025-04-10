import React, { useState, useEffect } from 'react';
import { PostProps } from '@/components/post/Post';
import { samplePosts, spaceOptions } from './utils/feedConstants';
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

export const useFeedData = (postsPerPage: number = 5, initialSegment: string = 'all') => {
  const [currentView, setCurrentView] = useState('all');
  const [filterState, filterActions] = useFilterState(initialSegment);
  const [hasSeenUpgradePrompt, setHasSeenUpgradePrompt] = useState(false);
  const { toast } = useToast();
  
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
  
  const applyFilters = () => {
    let filteredPosts = [...samplePosts];
    
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
      filterState.activeSpace
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
  };
};
