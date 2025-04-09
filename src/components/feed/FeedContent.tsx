
import React from 'react';
import { PostProps } from '@/components/post/Post';
import Post from '@/components/post/Post';
import FeedFilters from '@/components/feed/FeedFilters';
import EmptyFeed from '@/components/feed/EmptyFeed';
import FeedPagination from '@/components/feed/FeedPagination';
import PremiumContentUpgrade from '@/components/feed/PremiumContentUpgrade';

interface FeedContentProps {
  posts: PostProps[];
  contentFilter: string;
  setContentFilter: (filter: string) => void;
  accessFilter: string;
  setAccessFilter: (filter: string) => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasFilters: boolean;
  onClearFilters: () => void;
  activeSegment?: string;
}

const FeedContent: React.FC<FeedContentProps> = ({
  posts,
  contentFilter,
  setContentFilter,
  accessFilter,
  setAccessFilter,
  selectedTags,
  setSelectedTags,
  searchQuery,
  setSearchQuery,
  currentPage,
  totalPages,
  onPageChange,
  hasFilters,
  onClearFilters,
  activeSegment = 'all'
}) => {
  // Show premium upgrade CTA if in premium segment with no posts
  const showPremiumUpgrade = activeSegment === 'premium' && posts.length === 0;

  return (
    <div className="w-full">
      <FeedFilters 
        contentFilter={contentFilter}
        setContentFilter={setContentFilter}
        accessFilter={accessFilter}
        setAccessFilter={setAccessFilter}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {posts.length > 0 ? (
        <>
          <div className="space-y-4">
            {posts.map(post => (
              <Post 
                key={post.id} 
                {...post} 
                showAccessBadge={activeSegment !== 'all'}
              />
            ))}
          </div>
          
          {totalPages > 1 && (
            <FeedPagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          )}
        </>
      ) : showPremiumUpgrade ? (
        <PremiumContentUpgrade />
      ) : (
        <EmptyFeed 
          hasFilters={hasFilters} 
          onClearFilters={onClearFilters} 
        />
      )}
    </div>
  );
};

export default FeedContent;
