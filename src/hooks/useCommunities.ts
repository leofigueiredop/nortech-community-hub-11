
import { useState, useEffect } from 'react';
import { Community } from '@/types/community';
import { mockCommunities } from '@/types/community';

/**
 * Custom hook to fetch communities from the API
 * Currently uses mock data but can be updated to fetch from API
 */
export function useCommunities() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        setIsLoading(true);
        // In a real implementation, this would fetch from an API
        // const response = await fetch('/api/communities');
        // const data = await response.json();
        
        // Using mock data instead
        setCommunities(mockCommunities);
        setIsLoading(false);
      } catch (err: any) {
        setError(err instanceof Error ? err : new Error('Failed to fetch communities'));
        setIsLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  return { communities, isLoading, error };
}
