
import React from 'react';
import { PostProps } from '@/components/post/Post';
import Post from '@/components/post/Post';
import FeedFilters from '@/components/feed/FeedFilters';
import EmptyFeed from '@/components/feed/EmptyFeed';
import FeedPagination from '@/components/feed/FeedPagination';

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
  onClearFilters
}) => {
  return (
    <div className="md:col-span-2">
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
          {posts.map(post => (
            <Post key={post.id} {...post} />
          ))}
          
          {totalPages > 1 && (
            <FeedPagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          )}
        </>
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
