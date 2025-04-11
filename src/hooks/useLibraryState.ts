
import { useState, useCallback } from 'react';

export const useLibraryState = () => {
  const [visitedTags, setVisitedTags] = useState<string[]>([]);
  
  const addVisitedTag = useCallback((tag: string) => {
    setVisitedTags(prev => {
      if (prev.includes(tag)) return prev;
      return [...prev, tag];
    });
  }, []);

  return {
    visitedTags,
    addVisitedTag
  };
};
