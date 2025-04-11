
import { useState, useEffect } from 'react';
import { ContentItem } from '@/types/library';

export const useLibraryState = () => {
  const [visitedTags, setVisitedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(true);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);

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

    // Load recently viewed content
    const storedRecentlyViewed = localStorage.getItem('recentlyViewed');
    if (storedRecentlyViewed) {
      setRecentlyViewed(JSON.parse(storedRecentlyViewed));
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

  // Track viewed content
  const trackContentView = (contentId: string) => {
    if (!recentlyViewed.includes(contentId)) {
      const updatedViewed = [contentId, ...recentlyViewed].slice(0, 10); // Keep last 10
      setRecentlyViewed(updatedViewed);
      localStorage.setItem('recentlyViewed', JSON.stringify(updatedViewed));
    }
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return {
    visitedTags,
    showFilters,
    recentlyViewed,
    addVisitedTag,
    trackContentView,
    toggleFilters
  };
};
