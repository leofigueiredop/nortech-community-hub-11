
import { useState, useEffect } from 'react';

export interface FilterState {
  searchQuery: string;
  contentFilter: string;
  accessFilter: string;
  selectedTags: string[];
  activeSpace: string;
}

export interface FilterActions {
  setSearchQuery: (query: string) => void;
  setContentFilter: (filter: string) => void;
  setAccessFilter: (filter: string) => void;
  setSelectedTags: (tags: string[]) => void;
  setActiveSpace: (space: string) => void;
  clearAllFilters: () => void;
}

export const useFilterState = (initialActiveSegment: string = 'all'): [FilterState, FilterActions] => {
  const [searchQuery, setSearchQuery] = useState('');
  const [contentFilter, setContentFilter] = useState('all');
  const [accessFilter, setAccessFilter] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [activeSpace, setActiveSpace] = useState('all');

  // Update accessFilter based on initialActiveSegment
  useEffect(() => {
    if (initialActiveSegment === 'free') {
      setAccessFilter('free');
    } else if (initialActiveSegment === 'premium') {
      setAccessFilter('paid');
    } else {
      setAccessFilter('all');
    }
  }, [initialActiveSegment]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setContentFilter('all');
    setAccessFilter('all');
    setSelectedTags([]);
    setActiveSpace('all');
  };

  const state: FilterState = {
    searchQuery,
    contentFilter,
    accessFilter,
    selectedTags,
    activeSpace
  };

  const actions: FilterActions = {
    setSearchQuery,
    setContentFilter,
    setAccessFilter,
    setSelectedTags,
    setActiveSpace,
    clearAllFilters
  };

  return [state, actions];
};
