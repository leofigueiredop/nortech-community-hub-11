import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useLibraryContent } from '@/hooks/useLibraryContent';
import { useLibraryState } from '@/hooks/useLibraryState';
import ContentViewer from '@/components/library/ContentViewer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Filter, X, Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Drawer,
  DrawerContent,
  DrawerTrigger
} from '@/components/ui/drawer';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import LibraryContentRows from '@/components/library/LibraryContentRows';
import LibraryFiltersSidebar from '@/components/library/LibraryFiltersSidebar';
import FeaturedContentCarousel from '@/components/library/FeaturedContentCarousel';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import CreateContentModal from '@/components/library/CreateContentModal';

const Library: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [activeView, setActiveView] = useState<'all' | 'free' | 'premium' | 'unlockable'>('all');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateContentOpen, setIsCreateContentOpen] = useState(false);
  
  const {
    content,
    filteredContent,
    featuredContent,
    allTags,
    allFormats,
    formatFilter,
    tagFilter,
    accessFilter,
    sortBy,
    selectedItem,
    setFormatFilter,
    setTagFilter,
    setAccessFilter,
    setSearchQuery: setGlobalSearchQuery,
    setSortBy,
    setSelectedItem
  } = useLibraryContent();

  const {
    visitedTags,
    addVisitedTag
  } = useLibraryState();

  useEffect(() => {
    if (tagFilter !== 'all') {
      addVisitedTag(tagFilter);
    }
  }, [tagFilter, addVisitedTag]);

  useEffect(() => {
    if (activeView === 'all') {
      setAccessFilter('all');
    } else if (activeView === 'free') {
      setAccessFilter('free');
    } else if (activeView === 'premium') {
      setAccessFilter('premium');
    } else if (activeView === 'unlockable') {
      setAccessFilter('unlockable');
    }
  }, [activeView, setAccessFilter]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setGlobalSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, setGlobalSearchQuery]);

  const isSearchActive = searchQuery.trim() !== '';

  return (
    <MainLayout title="Content Library">
      <div className="relative min-h-screen flex flex-col">
        <div className="sticky top-0 z-30 w-full bg-background/95 backdrop-blur supports-backdrop-blur:bg-background/60 border-b">
          <div className="container flex h-14 max-w-screen-2xl items-center">
            <div className="mr-4 hidden md:flex">
              <h1 className="text-xl font-semibold">Content Library</h1>
            </div>
            
            <nav className="flex items-center space-x-2 lg:space-x-6 overflow-auto">
              <Button 
                variant={activeView === 'all' ? "default" : "ghost"} 
                onClick={() => setActiveView('all')}
                className="h-9"
              >
                All Content
              </Button>
              
              <Button 
                variant={activeView === 'free' ? "default" : "ghost"} 
                onClick={() => setActiveView('free')}
                className="h-9"
              >
                Free
              </Button>
              
              <Button 
                variant={activeView === 'premium' ? "default" : "ghost"} 
                onClick={() => setActiveView('premium')}
                className="h-9"
              >
                Premium
              </Button>
              
              <Button 
                variant={activeView === 'unlockable' ? "default" : "ghost"} 
                onClick={() => setActiveView('unlockable')}
                className="h-9"
              >
                Unlockable
              </Button>
            </nav>

            <div className="flex-1"></div>

            <div className="relative w-full max-w-sm mr-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search content..."
                className="w-full pl-8 h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {isSearchActive && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-9 w-9 p-0"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <Drawer open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
              <DrawerTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className={cn(
                    "flex items-center gap-2 h-9",
                    (formatFilter !== 'all' || tagFilter !== 'all' || sortBy !== 'newest') && 
                    "border-primary text-primary"
                  )}
                >
                  <Filter size={16} />
                  <span>Filters</span>
                  {(formatFilter !== 'all' || tagFilter !== 'all' || sortBy !== 'newest') && (
                    <span className="ml-1 rounded-full bg-primary w-4 h-4 flex items-center justify-center text-[10px] text-white">
                      {(formatFilter !== 'all' ? 1 : 0) + (tagFilter !== 'all' ? 1 : 0) + (sortBy !== 'newest' ? 1 : 0)}
                    </span>
                  )}
                </Button>
              </DrawerTrigger>
              <DrawerContent className="max-h-[85vh]">
                <div className="px-4 py-6 max-w-md mx-auto">
                  <h3 className="text-lg font-semibold mb-4">Content Filters</h3>
                  <LibraryFiltersSidebar
                    formatFilter={formatFilter}
                    tagFilter={tagFilter}
                    sortBy={sortBy}
                    allFormats={allFormats}
                    allTags={allTags}
                    setFormatFilter={setFormatFilter}
                    setTagFilter={setTagFilter}
                    setSortBy={setSortBy}
                    onClose={() => setIsFiltersOpen(false)}
                  />
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="container py-6 max-w-screen-2xl space-y-8">
            {featuredContent.length > 0 && !isSearchActive && activeView === 'all' && (
              <FeaturedContentCarousel 
                items={featuredContent}
                onItemSelect={setSelectedItem}
              />
            )}

            {isSearchActive ? (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">
                  Search Results: {filteredContent.length} items
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredContent.map(item => (
                    <div 
                      key={item.id} 
                      className="cursor-pointer"
                      onClick={() => setSelectedItem(item)}
                    >
                      <div className="aspect-video relative overflow-hidden rounded-lg mb-2">
                        <img 
                          src={item.thumbnailUrl || '/placeholder.svg'} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="font-medium line-clamp-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                    </div>
                  ))}
                </div>
                {filteredContent.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
                  </div>
                )}
              </div>
            ) : (
              <LibraryContentRows 
                content={content}
                activeView={activeView}
                visitedTags={visitedTags}
                onItemSelect={setSelectedItem}
              />
            )}
          </div>
        </ScrollArea>
      </div>

      <ContentViewer 
        item={selectedItem} 
        onClose={() => setSelectedItem(null)} 
      />

      <CreateContentModal 
        isOpen={isCreateContentOpen} 
        onClose={() => setIsCreateContentOpen(false)} 
      />

      <div className="fixed bottom-6 right-6 z-10">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={() => setIsCreateContentOpen(true)} 
                size="lg" 
                className="rounded-full w-14 h-14 shadow-lg"
              >
                <Plus className="h-6 w-6" />
                <span className="sr-only">Create Content</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Create New Content</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </MainLayout>
  );
};

export default Library;
