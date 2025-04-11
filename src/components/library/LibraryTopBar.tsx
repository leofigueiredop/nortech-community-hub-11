
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Filter, X, Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Drawer,
  DrawerContent,
  DrawerTrigger
} from '@/components/ui/drawer';
import { cn } from '@/lib/utils';
import LibraryFiltersSidebar from './LibraryFiltersSidebar';

interface LibraryTopBarProps {
  formatFilter: string;
  tagFilter: string;
  sortBy: string;
  activeView: string;
  searchQuery: string;
  setActiveView: (view: 'all' | 'free' | 'premium' | 'unlockable') => void;
  setSearchQuery: (query: string) => void;
  setGlobalSearchQuery: (query: string) => void;
  allTags: string[];
  allFormats: string[];
  setFormatFilter: (format: string) => void;
  setTagFilter: (tag: string) => void;
  setSortBy: (sort: string) => void;
}

const LibraryTopBar: React.FC<LibraryTopBarProps> = ({
  formatFilter,
  tagFilter,
  sortBy,
  activeView,
  searchQuery,
  setActiveView,
  setSearchQuery,
  setGlobalSearchQuery,
  allTags,
  allFormats,
  setFormatFilter,
  setTagFilter,
  setSortBy
}) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  const isSearchActive = searchQuery.trim() !== '';

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setGlobalSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, setGlobalSearchQuery]);

  return (
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
  );
};

export default LibraryTopBar;
