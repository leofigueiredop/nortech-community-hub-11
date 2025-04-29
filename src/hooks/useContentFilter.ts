import { useState, useEffect, useMemo } from 'react';
import { ContentItem } from '@/types/content';
import { FilterService, FilterOptions } from '@/services/FilterService';
import { useFilterState } from '@/components/feed/hooks/useFilterState';

export const useContentFilter = (items: ContentItem[]) => {
  const [filteredItems, setFilteredItems] = useState<ContentItem[]>(items);
  const [sortBy, setSortBy] = useState('newest');
  const [filterState, filterActions] = useFilterState();

  // Convert filter state to filter options
  const filterOptions = useMemo<FilterOptions>(() => ({
    searchQuery: filterState.searchQuery,
    contentType: filterState.contentFilter,
    accessLevel: filterState.accessFilter,
    tags: filterState.selectedTags,
    space: filterState.activeSpace,
  }), [filterState]);

  // Apply filters and sorting whenever items or filter options change
  useEffect(() => {
    let result = FilterService.filterContent(items, filterOptions);
    result = FilterService.sortContent(result, sortBy);
    setFilteredItems(result);
  }, [items, filterOptions, sortBy]);

  return {
    filteredItems,
    filterState,
    filterActions,
    sortBy,
    setSortBy,
    totalItems: items.length,
    filteredCount: filteredItems.length,
  };
}; 