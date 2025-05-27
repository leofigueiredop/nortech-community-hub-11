import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import CreatePostDialog from '@/components/post/CreatePostDialog';
import FeedContent from '@/components/feed/FeedContent';
import TierSwitcher from '@/components/debug/TierSwitcher';
import SettingsPopover from '@/components/feed/SettingsPopover';
import ViewControls from '@/components/feed/ViewControls';
import { useFeedData } from '@/components/feed/useFeedData';
import FeedSegmentTabs from '@/components/feed/FeedSegmentTabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';

const Feed: React.FC = () => {
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const { isOwnerOrAdmin, loading: roleLoading } = useUserRole();
  
  // Get the last selected feed segment from localStorage or default to 'all'
  const getInitialSegment = () => {
    const savedSegment = localStorage.getItem('feedSegment');
    return savedSegment ? savedSegment : 'all';
  };
  
  const [activeSegment, setActiveSegment] = useState(getInitialSegment());
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  // In a real app, this would check the user's subscription status from the backend
  useEffect(() => {
    // Mock implementation - in a real app this would be an API call
    const checkSubscription = async () => {
      // This would be an actual API call in a real implementation
      // const response = await api.checkSubscription();
      // setIsSubscribed(response.isSubscribed);
      
      // For demo purposes, let's assume the user is not subscribed
      setIsSubscribed(false);
    };
    
    checkSubscription();
  }, []);
  
  // Update localStorage when segment changes
  useEffect(() => {
    localStorage.setItem('feedSegment', activeSegment);
  }, [activeSegment]);
  
  const {
    currentView,
    setCurrentView,
    searchQuery,
    setSearchQuery,
    contentFilter,
    setContentFilter,
    accessFilter,
    setAccessFilter,
    selectedTags,
    setSelectedTags,
    activeSpace,
    setActiveSpace,
    currentPage,
    setCurrentPage,
    spaceOptions,
    filteredPosts,
    totalPages,
    hasFilters,
    clearAllFilters,
    loading,
    error,
    isPremiumUser
  } = useFeedData(5, activeSegment);

  // Set accessFilter and activeSpace based on activeSegment
  useEffect(() => {
    if (activeSegment === 'free') {
      setAccessFilter('free');
      setActiveSpace('Free Group');
    } else if (activeSegment === 'premium') {
      setAccessFilter('paid');
      setActiveSpace('Premium Group');
    } else if (activeSegment === 'mentor') {
      setAccessFilter('all');
      setActiveSpace('Mentorship Circle');
    } else {
      setAccessFilter('all');
      setActiveSpace('all');
    }
  }, [activeSegment, setAccessFilter, setActiveSpace]);

  const handleViewChange = (view: string) => {
    setCurrentView(view);
  };

  const handleSpaceChange = (space: string) => {
    setActiveSpace(space);
  };

  // Prepare posts with proper access badges
  const preparedPosts = filteredPosts.map(post => {
    // Mark posts as premium in the premium segment if not subscribed
    if (activeSegment === 'premium' && !isSubscribed) {
      return {
        ...post,
        accessBadge: 'premium'
      };
    }
    
    // Add teaser to premium posts if they don't have one already
    if (post.isPaid && !post.teaser) {
      return {
        ...post,
        teaser: "This is a preview of premium content. Subscribe to see the full post."
      };
    }
    
    return post;
  });

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-4 w-full">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg border p-4 space-y-3">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error loading posts</AlertTitle>
          <AlertDescription>
            {error}. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <FeedContent
        posts={preparedPosts}
        contentFilter={contentFilter}
        setContentFilter={setContentFilter}
        accessFilter={accessFilter}
        setAccessFilter={setAccessFilter}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        hasFilters={hasFilters}
        onClearFilters={clearAllFilters}
        activeSegment={activeSegment}
      />
    );
  };

  return (
    <MainLayout title="Feed">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <SettingsPopover />
        </div>
        
        <ViewControls
          currentView={currentView}
          onViewChange={handleViewChange}
          onCreatePost={() => setCreatePostOpen(true)}
        />
      </div>
      
      <FeedSegmentTabs 
        activeSegment={activeSegment} 
        setActiveSegment={setActiveSegment}
        spaceOptions={spaceOptions}
        activeSpace={activeSpace}
        onSpaceChange={handleSpaceChange}
      />

      <div className="w-full">
        {renderContent()}
      </div>

      <CreatePostDialog
        open={createPostOpen}
        onOpenChange={setCreatePostOpen}
      />
      <TierSwitcher />
    </MainLayout>
  );
};

export default Feed;
