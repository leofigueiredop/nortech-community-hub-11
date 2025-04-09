
import { useState, useEffect } from 'react';
import { Reward } from '@/types/rewards';
import { useToast } from '@/hooks/use-toast';

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

export const useRewardsAdmin = () => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate API fetch
    const fetchRewards = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setRewards(MOCK_REWARDS);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to fetch rewards:', err);
        setIsLoading(false);
      }
    };

    fetchRewards();
  }, []);

  const addReward = async (rewardData: Partial<Reward>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newReward: Reward = {
      id: Date.now().toString(),
      title: rewardData.title || '',
      description: rewardData.description || '',
      imageUrl: rewardData.imageUrl || undefined,
      pointsCost: rewardData.pointsCost || 0,
      type: rewardData.type || 'free',
      visibility: rewardData.visibility || 'public',
      stock: rewardData.stock !== undefined ? rewardData.stock : null,
      expiresAt: rewardData.expiresAt || null,
      createdAt: new Date().toISOString(),
      redeemCount: 0,
      actionUrl: rewardData.actionUrl
    };
    
    setRewards(prev => [newReward, ...prev]);
    
    toast({
      title: "Reward Created",
      description: `${newReward.title} has been created successfully.`,
    });
    
    return newReward;
  };

  const updateReward = async (id: string, rewardData: Partial<Reward>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setRewards(prev => prev.map(reward => 
      reward.id === id 
        ? { ...reward, ...rewardData } 
        : reward
    ));
    
    toast({
      title: "Reward Updated",
      description: `The reward has been updated successfully.`,
    });
  };

  const deleteReward = async (id: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setRewards(prev => prev.filter(reward => reward.id !== id));
    
    toast({
      title: "Reward Deleted",
      description: `The reward has been deleted.`,
    });
  };

  return {
    rewards,
    isLoading,
    addReward,
    updateReward,
    deleteReward
  };
};
