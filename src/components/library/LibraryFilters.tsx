
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface LibraryFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const LibraryFilters: React.FC<LibraryFiltersProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="sticky top-16 z-20 bg-background/95 backdrop-blur supports-backdrop-blur:bg-background/60 border-b">
      <div className="container max-w-screen-2xl py-3">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search content library..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 bg-background w-full"
          />
          {searchQuery && (
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => onSearchChange('')}
            >
              ×
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LibraryFilters;
