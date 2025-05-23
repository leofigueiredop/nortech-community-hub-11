import { useState, useEffect } from 'react';
import { Redemption, Reward } from '@/types/rewards';
import { api } from '@/api/ApiClient';
import { useAuth } from '@/context/AuthContext';

// Type for the API status
type RedemptionStatus = 'pending' | 'completed' | 'cancelled' | 'fulfilled' | 'expired';

export const useRedemptionHistory = () => {
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    // Only fetch if we have a user
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    const fetchRedemptions = async () => {
      try {
        setIsLoading(true);
        
        // Fetch redemptions from the API
        const apiRedemptions = await api.points.getRedemptions(user.id);
        
        // Convert to the expected Redemption type
        const formattedRedemptions = apiRedemptions.map(item => {
          // Map API status to a valid RedemptionStatus type
          let validStatus: RedemptionStatus = 'pending'; // Default
          
          // Safely check if the item.status is a valid RedemptionStatus type
          if (item.status && 
             ['pending', 'completed', 'cancelled', 'fulfilled', 'expired'].includes(item.status)) {
            validStatus = item.status as RedemptionStatus;
          }
          
          return {
            id: item.id,
            user_id: item.user_id,
            reward_id: item.reward_id,
            community_id: item.community_id,
            redeemed_at: item.created_at, // Use created_at as redeemed_at
            status: validStatus,
            pointsSpent: item.points_spent || 0,
            created_at: item.created_at,
            createdAt: item.created_at,
            reward: item.rewards ? {
              id: item.rewards.id,
              name: item.rewards.name,
              title: item.rewards.name,
              description: item.rewards.description || '',
              image_url: item.rewards.image_url || '',
              imageUrl: item.rewards.image_url || '',
              points_cost: item.rewards.points_cost || 0,
              pointsCost: item.rewards.points_cost || 0,
              is_active: item.rewards.is_active || true,
              stock: item.rewards.quantity_available || null,
              created_at: item.rewards.created_at || '',
              createdAt: item.rewards.created_at || '',
              type: 'reward',
              visibility: 'public',
              community_id: item.rewards.community_id
            } : undefined
          };
        });
        
        setRedemptions(formattedRedemptions);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching redemption history:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch redemption history'));
        setIsLoading(false);
      }
    };

    fetchRedemptions();
  }, [user]);

  return {
    redemptions,
    isLoading,
    error
  };
};
