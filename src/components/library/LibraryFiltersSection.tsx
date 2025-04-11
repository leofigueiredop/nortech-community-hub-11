
import React from 'react';
import ContentFilters from './ContentFilters';

interface LibraryFiltersSectionProps {
  formatFilter: string;
  tagFilter: string;
  accessFilter: string;
  searchQuery: string;
  sortBy: string;
  allFormats: string[];
  allTags: string[];
  setFormatFilter: (format: string) => void;
  setTagFilter: (tag: string) => void;
  setAccessFilter: (level: string) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: string) => void;
  showFilters: boolean;
}

const LibraryFiltersSection: React.FC<LibraryFiltersSectionProps> = ({
  formatFilter,
  tagFilter,
  accessFilter,
  searchQuery,
  sortBy,
  allFormats,
  allTags,
  setFormatFilter,
  setTagFilter,
  setAccessFilter,
  setSearchQuery,
  setSortBy,
  showFilters
}) => {
  return (
    <>
      {showFilters && (
        <ContentFilters
          formatFilter={formatFilter}
          tagFilter={tagFilter}
          accessFilter={accessFilter}
          searchQuery={searchQuery}
          sortBy={sortBy}
          allFormats={allFormats}
          allTags={allTags}
          setFormatFilter={setFormatFilter}
          setTagFilter={setTagFilter}
          setAccessFilter={setAccessFilter}
          setSearchQuery={setSearchQuery}
          setSortBy={setSortBy}
        />
      )}
    </>
  );
};

export default LibraryFiltersSection;
