import React from 'react';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface LibraryFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  openFiltersSidebar?: () => void;
  totalResults?: number;
}

const LibraryFilters: React.FC<LibraryFiltersProps> = ({
  searchQuery,
  onSearchChange,
  openFiltersSidebar,
  totalResults = 0
}) => {
  return (
    <div className="sticky top-16 z-20 bg-background/95 backdrop-blur supports-backdrop-blur:bg-background/60 border-b">
      <div className="container py-4 flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search content..."
            className="pl-10 w-full"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
              onClick={() => onSearchChange("")}
            >
              <span className="sr-only">Clear</span>
              <span className="text-sm">×</span>
            </Button>
          )}
        </div>
        
        {searchQuery ? (
          <div className="text-sm text-muted-foreground whitespace-nowrap">
            {totalResults} results
          </div>
        ) : null}
        
        <div className="flex items-center gap-2">
          {/* For desktop */}
          <Button 
            variant="outline" 
            size="sm" 
            className="hidden md:flex items-center gap-2"
            onClick={openFiltersSidebar}
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          
          {/* For mobile */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="sr-only">Filters</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="py-4">
                <div className="space-y-4">
                  {/* Mobile filters content would go here */}
                  <p className="text-sm text-muted-foreground">
                    Filter options will appear here.
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};

export default LibraryFilters;
