
import { useState, useEffect } from 'react';
import { ContentItem } from '@/types/library';

export const useLibraryState = () => {
  const [visitedTags, setVisitedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(true);

  // Simulate user interests based on local storage or default to some tags
  useEffect(() => {
    // In a real app, this would come from user behavior tracking
    const storedTags = localStorage.getItem('visitedTags');
    if (storedTags) {
      setVisitedTags(JSON.parse(storedTags));
    } else {
      // Default tags for new users
      const defaultTags = ['Web3', 'Development', 'AI'];
      setVisitedTags(defaultTags);
      localStorage.setItem('visitedTags', JSON.stringify(defaultTags));
    }
  }, []);

  // Helper to add a new tag to visited tags
  const addVisitedTag = (tag: string) => {
    if (!visitedTags.includes(tag)) {
      const updatedTags = [...visitedTags, tag].slice(-5); // Keep last 5
      setVisitedTags(updatedTags);
      localStorage.setItem('visitedTags', JSON.stringify(updatedTags));
    }
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return {
    visitedTags,
    showFilters,
    addVisitedTag,
    toggleFilters
  };
};
