import { useState, useEffect } from 'react';
import { Community } from '@/types/community';
import { api } from '@/api/ApiClient';

/**
 * Custom hook to fetch communities from the API
 */
export function useCommunities() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        setIsLoading(true);
        
        // Fetch communities directly from Supabase
        const { data: fetchedCommunities, error: apiError } = await api.supabase
          .from('communities')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (apiError) {
          throw apiError;
        }
        
        setCommunities(fetchedCommunities || []);
        setIsLoading(false);
      } catch (err: any) {
        console.error('Error fetching communities:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch communities'));
        setIsLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  return { communities, isLoading, error };
}
