
import { useState, useEffect } from 'react';
import { Redemption } from '@/types/rewards';

// Mock data for demonstration
const MOCK_REDEMPTIONS: Redemption[] = [
  {
    id: '1',
    userId: 'current-user',
    rewardId: '1',
    pointsSpent: 100,
    status: 'completed',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    reward: {
      id: '1',
      title: 'Community Member Badge',
      description: 'Show off your community membership with this exclusive badge on your profile.',
      imageUrl: '/placeholder.svg',
      pointsCost: 100,
      type: 'free',
      visibility: 'public',
      stock: null,
      expiresAt: null,
      createdAt: new Date().toISOString(),
      redeemCount: 42
    }
  },
  {
    id: '2',
    userId: 'current-user',
    rewardId: '3',
    pointsSpent: 250,
    status: 'completed',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    reward: {
      id: '3',
      title: 'Private Discord Channel Access',
      description: 'Get exclusive access to our private Discord channels for 30 days.',
      imageUrl: '/placeholder.svg',
      pointsCost: 250,
      type: 'access',
      visibility: 'vip',
      stock: null,
      expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
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
