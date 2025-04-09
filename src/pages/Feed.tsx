
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import CreatePostDialog from '@/components/post/CreatePostDialog';
import SpacesSidebar from '@/components/feed/SpacesSidebar';
import FeedContent from '@/components/feed/FeedContent';
import SettingsPopover from '@/components/feed/SettingsPopover';
import ViewControls from '@/components/feed/ViewControls';
import { useFeedData } from '@/components/feed/useFeedData';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import FeedSegmentTabs from '@/components/feed/FeedSegmentTabs';

const Feed: React.FC = () => {
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isMobile } = useIsMobile();
  
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
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  // Mobile sidebar implementation using Drawer
  const MobileSidebar = () => (
    <Drawer open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[80vh]">
        <div className="p-4">
          <SpacesSidebar 
            spaces={spaceOptions} 
            activeSpace={activeSpace} 
            onSpaceChange={handleSpaceChange} 
          />
        </div>
      </DrawerContent>
    </Drawer>
  );

  // Desktop sidebar implementation using Sheet
  const DesktopSidebar = () => (
    <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="hidden md:flex lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <SpacesSidebar 
          spaces={spaceOptions} 
          activeSpace={activeSpace} 
          onSpaceChange={handleSpaceChange} 
        />
      </SheetContent>
    </Sheet>
  );

  return (
    <MainLayout title="Feed">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <MobileSidebar />
          <DesktopSidebar />
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
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Only visible on large screens by default */}
        <div className="hidden lg:block lg:col-span-1">
          <SpacesSidebar 
            spaces={spaceOptions} 
            activeSpace={activeSpace} 
            onSpaceChange={handleSpaceChange} 
          />
        </div>

        {/* Main content - Takes full width on mobile and tablets, 3/4 on desktop */}
        <div className="lg:col-span-3 col-span-1 w-full">
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
      </div>

      <CreatePostDialog
        open={createPostOpen}
        onOpenChange={setCreatePostOpen}
      />
    </MainLayout>
  );
};

export default Feed;
