import React from 'react';
import SearchBar from './filters/SearchBar';
import FilterDropdown from './filters/FilterDropdown';
import TrendingTopics from './filters/TrendingTopics';
import { getContentTypes, getAccessTypes, popularTags } from './filters/filterConstants';
import { useTranslation } from 'react-i18next';

interface FeedFiltersProps {
  contentFilter: string;
  setContentFilter: (filter: string) => void;
  accessFilter: string;
  setAccessFilter: (filter: string) => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const FeedFilters: React.FC<FeedFiltersProps> = ({
  contentFilter,
  setContentFilter,
  accessFilter,
  setAccessFilter,
  selectedTags,
  setSelectedTags,
  searchQuery,
  setSearchQuery
}) => {
  const { t } = useTranslation('common');
  const contentTypes = getContentTypes(t);
  const accessTypes = getAccessTypes(t);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const clearTags = () => {
    setSelectedTags([]);
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="flex items-center gap-3">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        
        <FilterDropdown
          contentFilter={contentFilter}
          setContentFilter={setContentFilter}
          accessFilter={accessFilter}
          setAccessFilter={setAccessFilter}
        />
      </div>
      
      <TrendingTopics
        selectedTags={selectedTags}
        toggleTag={toggleTag}
        clearTags={clearTags}
        popularTags={popularTags}
      />
    </div>
  );
};

export default FeedFilters;
