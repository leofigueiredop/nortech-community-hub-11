
import { useState, useEffect } from 'react';
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

export const useFeedData = (postsPerPage: number = 5, initialSegment: string = 'all') => {
  const [currentView, setCurrentView] = useState('all');
  const [filterState, filterActions] = useFilterState(initialSegment);
  const [hasSeenUpgradePrompt, setHasSeenUpgradePrompt] = useState(false);
  const { toast } = useToast();
  
  // Check for premium content interactions on mount
  useEffect(() => {
    const premiumInteractions = parseInt(localStorage.getItem('premiumInteractions') || '0');
    
    // If user has interacted with premium content at least 5 times and hasn't seen the prompt yet
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

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "ghost" | "outline"; }
>(({ className, variant, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={`px-4 py-2 rounded-sm text-sm font-medium ${
        variant === "default" 
          ? "bg-primary text-primary-foreground hover:bg-primary/90" 
          : variant === "outline"
          ? "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
          : "hover:bg-accent hover:text-accent-foreground"
      } ${className}`}
      {...props}
    />
  );
});
Button.displayName = "Button";
