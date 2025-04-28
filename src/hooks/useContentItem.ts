
import { useState, useEffect } from 'react';
import { ContentItem } from '@/types/library';
import { useContentItems } from './useContentItems';
import { CONTENT_ITEMS } from '@/data/mockLibraryData';

/**
 * Hook to fetch and provide a single content item by ID
 */
export const useContentItem = (id: string) => {
  const [contentItem, setContentItem] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchContentItem = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // In a real app, this would be an API call to fetch the content item
        // For now, we'll just simulate an API call using the mock data
        const item = CONTENT_ITEMS.find(item => item.id === id);
        
        if (item) {
          // Simulate a small delay for loading state
          setTimeout(() => {
            setContentItem(item);
            setLoading(false);
          }, 500);
        } else {
          throw new Error(`Content item with id ${id} not found`);
        }
      } catch (err) {
        console.error('Error fetching content item:', err);
        setError(err as Error);
        setLoading(false);
      }
    };

    fetchContentItem();
  }, [id]);

  // Update content view count
  useEffect(() => {
    const updateViewCount = async () => {
      if (!contentItem || loading || error) return;

      // In a real app, this would be an API call to update the view count
      // For now, we'll just log it
      console.log(`Content item ${contentItem.id} viewed`);
    };

    updateViewCount();
  }, [contentItem, loading, error]);

  return {
    contentItem,
    loading,
    error,
  };
};
