import { useState, useEffect } from 'react';
import { Reward } from '@/types/rewards';
import { api } from '@/api/ApiClient';
import { useAuth } from '@/context/AuthContext';

export const useRewards = () => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { community } = useAuth();

  useEffect(() => {
    // Only fetch if we have a community
    if (!community) {
      setIsLoading(false);
      return;
    }
    
    const fetchRewards = async () => {
      try {
        setIsLoading(true);
        
        // Fetch rewards directly from Supabase
        const { data: apiRewards, error: fetchError } = await api.supabase
          .from('rewards')
          .select('*')
          .eq('community_id', community.id)
          .eq('is_active', true)
          .order('points_cost', { ascending: true });
          
        if (fetchError) {
          throw fetchError;
        }
        
        // Convert to the expected Reward type
        if (apiRewards) {
          const formattedRewards = apiRewards.map(reward => ({
            id: reward.id,
            name: reward.name,
            title: reward.name,
            description: reward.description || '',
            image_url: reward.image_url || '/placeholder.svg',
            imageUrl: reward.image_url || '/placeholder.svg',
            points_cost: reward.points_cost || 0,
            pointsCost: reward.points_cost || 0,
            type: reward.reward_type || 'digital',
            reward_type: reward.reward_type || 'digital',
            visibility: 'public',
            stock: reward.quantity_available,
            quantity_available: reward.quantity_available,
            expires_at: reward.expires_at,
            expiresAt: reward.expires_at,
            created_at: reward.created_at,
            createdAt: reward.created_at,
            is_active: reward.is_active,
            redeemCount: 0,
            community_id: reward.community_id
          }));
          
          setRewards(formattedRewards);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching rewards:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch rewards'));
        setIsLoading(false);
      }
    };

    fetchRewards();
  }, [community]);

  return {
    rewards,
    isLoading,
    error
  };
};
