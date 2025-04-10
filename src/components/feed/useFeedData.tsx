
import { useState } from 'react';
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

export const useFeedData = (postsPerPage: number = 5, initialSegment: string = 'all') => {
  const [currentView, setCurrentView] = useState('all');
  const [filterState, filterActions] = useFilterState(initialSegment);
  
  // Apply all filters to posts
  const applyFilters = () => {
    let filteredPosts = [...samplePosts];
    
    // Apply each filter in sequence
    filteredPosts = filterBySpace(filteredPosts, filterState.activeSpace);
    filteredPosts = filterByContentType(filteredPosts, filterState.contentFilter);
    filteredPosts = filterByAccessLevel(filteredPosts, filterState.accessFilter);
    filteredPosts = filterByTags(filteredPosts, filterState.selectedTags);
    filteredPosts = filterBySearchQuery(filteredPosts, filterState.searchQuery);
    
    // Sort posts (pinned first)
    return sortPosts(filteredPosts);
  };
  
  const sortedFilteredPosts = applyFilters();
  
  // Setup pagination
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
  
  // Get current page posts
  const currentPosts = paginatedItems(sortedFilteredPosts);
  
  // Check if any filters are active
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
