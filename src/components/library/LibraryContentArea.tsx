
import React from 'react';
import { ContentItem } from '@/types/library';
import { ScrollArea } from '@/components/ui/scroll-area';
import LibraryContentRows from '@/components/library/LibraryContentRows';
import FeaturedContentCarousel from '@/components/library/FeaturedContentCarousel';

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
  activeView,
  featuredContent,
  content,
  visitedTags,
  onItemSelect
}) => {
  return (
    <ScrollArea className="flex-1">
      <div className="container py-6 max-w-screen-2xl space-y-8">
        {featuredContent.length > 0 && !isSearchActive && activeView === 'all' && (
          <FeaturedContentCarousel 
            items={featuredContent}
            onItemSelect={onItemSelect}
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
                  onClick={() => onItemSelect(item)}
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
            onItemSelect={onItemSelect}
          />
        )}
      </div>
    </ScrollArea>
  );
};

export default LibraryContentArea;
