
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import CreatePostDialog from '@/components/post/CreatePostDialog';
import FeedContent from '@/components/feed/FeedContent';
import SettingsPopover from '@/components/feed/SettingsPopover';
import ViewControls from '@/components/feed/ViewControls';
import { useFeedData } from '@/components/feed/useFeedData';
import FeedSegmentTabs from '@/components/feed/FeedSegmentTabs';

const Feed: React.FC = () => {
  const [createPostOpen, setCreatePostOpen] = useState(false);
  
  // Get the last selected feed segment from localStorage or default to 'all'
  const getInitialSegment = () => {
    const savedSegment = localStorage.getItem('feedSegment');
    return savedSegment ? savedSegment : 'all';
  };
  
  const [activeSegment, setActiveSegment] = useState(getInitialSegment());
  
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
  } = useFeedData();

  // Set accessFilter based on activeSegment
  useEffect(() => {
    if (activeSegment === 'free') {
      setAccessFilter('free');
    } else if (activeSegment === 'premium') {
      setAccessFilter('paid');
    } else {
      setAccessFilter('all');
    }
  }, [activeSegment, setAccessFilter]);

  const handleViewChange = (view: string) => {
    setCurrentView(view);
  };

  const handleSpaceChange = (space: string) => {
    setActiveSpace(space);
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
        <FeedContent
          posts={filteredPosts}
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
      </div>

      <CreatePostDialog
        open={createPostOpen}
        onOpenChange={setCreatePostOpen}
      />
    </MainLayout>
  );
};

export default Feed;
