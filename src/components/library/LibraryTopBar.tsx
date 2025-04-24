
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Filter, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Drawer,
  DrawerContent,
  DrawerTrigger
} from '@/components/ui/drawer';
import { cn } from '@/lib/utils';
import LibraryFiltersSidebar from './LibraryFiltersSidebar';
import { Link } from 'react-router-dom';

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
  searchQuery,
  setSearchQuery,
  setGlobalSearchQuery,
  allTags,
  allFormats,
  setFormatFilter,
  setTagFilter,
  setSortBy
}) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  const hasActiveFilters = formatFilter !== 'all' || tagFilter !== 'all' || sortBy !== 'newest';

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setGlobalSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, setGlobalSearchQuery]);

  return (
    <div className="sticky top-0 z-30 w-full bg-background/95 backdrop-blur supports-backdrop-blur:bg-background/60 border-b">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">Content Library</h1>
          <div className="relative max-w-md">
            <Input
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[300px]"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Drawer open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <DrawerTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className={cn(
                  "flex items-center gap-2 h-9",
                  hasActiveFilters && "border-primary text-primary"
                )}
              >
                <Filter size={16} />
                <span>Filters</span>
                {hasActiveFilters && (
                  <span className="ml-1 rounded-full bg-primary w-5 h-5 flex items-center justify-center text-[10px] text-primary-foreground">
                    {(formatFilter !== 'all' ? 1 : 0) + (tagFilter !== 'all' ? 1 : 0) + (sortBy !== 'newest' ? 1 : 0)}
                  </span>
                )}
              </Button>
            </DrawerTrigger>
            <DrawerContent className="max-h-[85vh]">
              <div className="px-4 py-6 max-w-md mx-auto">
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

          <Link to="/content-creator-dashboard">
            <Button className="gap-2 ml-2">
              <Settings size={16} />
              <span className="hidden sm:inline">Creator Dashboard</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LibraryTopBar;
