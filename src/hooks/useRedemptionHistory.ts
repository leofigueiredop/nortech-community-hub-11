
import { useState, useEffect } from 'react';
import { Redemption, Reward } from '@/types/rewards';

// Mock data for demonstration
const MOCK_REDEMPTIONS: Redemption[] = [
  {
    id: '1',
    user_id: 'current-user',
    reward_id: '1',
    redeemed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    pointsSpent: 100,
    status: 'fulfilled',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    community_id: 'community-1',
    reward: {
      id: '1',
      community_id: 'community-1',
      name: 'Community Member Badge',
      title: 'Community Member Badge',
      description: 'Show off your community membership with this exclusive badge on your profile.',
      image_url: '/placeholder.svg',
      imageUrl: '/placeholder.svg',
      points_cost: 100,
      pointsCost: 100,
      is_active: true,
      stock: null,
      created_at: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      type: 'free',
      visibility: 'public',
      redeemCount: 42
    }
  },
  {
    id: '2',
    user_id: 'current-user',
    reward_id: '3',
    redeemed_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    pointsSpent: 250,
    status: 'fulfilled',
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    community_id: 'community-1',
    reward: {
      id: '3',
      community_id: 'community-1',
      name: 'Private Discord Channel Access',
      title: 'Private Discord Channel Access',
      description: 'Get exclusive access to our private Discord channels for 30 days.',
      image_url: '/placeholder.svg',
      imageUrl: '/placeholder.svg',
      points_cost: 250,
      pointsCost: 250,
      is_active: true,
      stock: null,
      created_at: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      expires_at: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
      expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
      type: 'access',
      visibility: 'vip',
      redeemCount: 28
    }
  }
];

export const useRedemptionHistory = () => {
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Simulate API fetch
    const fetchRedemptions = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setRedemptions(MOCK_REDEMPTIONS);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch redemption history'));
        setIsLoading(false);
      }
    };

    fetchRedemptions();
  }, []);

  return {
    redemptions,
    isLoading,
    error
  };
};
