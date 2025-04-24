
import React from 'react';
import { ContentItem } from '@/types/library';
import { ScrollArea } from '@/components/ui/scroll-area';
import LibraryContent from './LibraryContent';

interface LibraryContentAreaProps {
  isSearchActive: boolean;
  filteredContent: ContentItem[];
  searchQuery: string;
  activeView: 'all' | 'free' | 'premium' | 'unlockable';
  featuredContent: ContentItem[];
  content: ContentItem[];
  visitedTags: string[];
  onItemSelect: (item: ContentItem) => void;
}

const LibraryContentArea: React.FC<LibraryContentAreaProps> = ({
  isSearchActive,
  filteredContent,
  searchQuery,
  content,
  onItemSelect
}) => {
  return (
    <ScrollArea className="flex-1">
      {isSearchActive ? (
        <div className="container py-6 max-w-screen-2xl space-y-6">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <span>Search Results</span>
            <span className="px-2 py-0.5 bg-muted rounded-full text-sm font-normal">
              {filteredContent.length} items
            </span>
          </h2>
          {filteredContent.length === 0 && (
            <div className="text-center py-16 bg-muted/30 rounded-lg border border-dashed">
              <h3 className="text-xl font-medium mb-2">No results found</h3>
              <p className="text-muted-foreground">Try adjusting your search for "{searchQuery}"</p>
            </div>
          )}
        </div>
      ) : (
        <LibraryContent 
          content={content}
          onItemSelect={onItemSelect}
        />
      )}
    </ScrollArea>
  );
};

export default LibraryContentArea;
