
import { useState, useEffect } from 'react';
import { Reward } from '@/types/rewards';

// Mock data for demonstration
const MOCK_REWARDS: Reward[] = [
  {
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
  },
  {
    id: '2',
    title: 'Premium E-Book Bundle',
    description: 'Access to 5 premium e-books on web development and design.',
    imageUrl: '/placeholder.svg',
    pointsCost: 500,
    type: 'downloadable',
    visibility: 'public',
    stock: 10,
    expiresAt: null,
    createdAt: new Date().toISOString(),
    redeemCount: 15
  },
  {
    id: '3',
    title: 'Private Discord Channel Access',
    description: 'Get exclusive access to our private Discord channels for 30 days.',
    imageUrl: '/placeholder.svg',
    pointsCost: 250,
    type: 'access',
    visibility: 'vip',
    stock: null,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    redeemCount: 28
  },
  {
    id: '4',
    title: 'Limited Edition NFT',
    description: 'Claim this limited edition NFT to show your early membership in our community.',
    imageUrl: '/placeholder.svg',
    pointsCost: 1000,
    type: 'nft',
    visibility: 'limited',
    stock: 5,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    redeemCount: 3
  },
];

export const useRewards = () => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Simulate API fetch
    const fetchRewards = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setRewards(MOCK_REWARDS);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch rewards'));
        setIsLoading(false);
      }
    };

    fetchRewards();
  }, []);

  return {
    rewards,
    isLoading,
    error
  };
};
