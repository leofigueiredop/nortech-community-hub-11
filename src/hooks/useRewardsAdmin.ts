
import { useState, useEffect } from 'react';
import { Reward } from '@/types/rewards';
import { useToast } from '@/hooks/use-toast';

// Mock data for demonstration
const MOCK_REWARDS: Reward[] = [
  {
    id: '1',
    name: 'Community Member Badge',
    title: 'Community Member Badge',
    description: 'Show off your community membership with this exclusive badge on your profile.',
    imageUrl: '/placeholder.svg',
    image_url: '/placeholder.svg',
    points_cost: 100,
    pointsCost: 100,
    type: 'free',
    reward_type: 'digital', // Updated to match allowed type
    visibility: 'public',
    stock: null,
    quantity_available: null,
    expiresAt: null,
    expires_at: null,
    created_at: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    is_active: true,
    redeemCount: 42,
    community_id: 'default'
  },
  {
    id: '2',
    name: 'Premium E-Book Bundle',
    title: 'Premium E-Book Bundle',
    description: 'Access to 5 premium e-books on web development and design.',
    imageUrl: '/placeholder.svg',
    image_url: '/placeholder.svg',
    points_cost: 500,
    pointsCost: 500,
    type: 'downloadable',
    reward_type: 'digital', // Updated to match allowed type
    visibility: 'public',
    stock: 10,
    quantity_available: 10,
    expiresAt: null,
    expires_at: null,
    created_at: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    is_active: true,
    redeemCount: 15,
    community_id: 'default'
  },
  {
    id: '3',
    name: 'Private Discord Channel Access',
    title: 'Private Discord Channel Access',
    description: 'Get exclusive access to our private Discord channels for 30 days.',
    imageUrl: '/placeholder.svg',
    image_url: '/placeholder.svg',
    points_cost: 250,
    pointsCost: 250,
    type: 'access',
    reward_type: 'digital', // Updated to match allowed type
    visibility: 'vip',
    stock: null,
    quantity_available: null,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    is_active: true,
    redeemCount: 28,
    community_id: 'default'
  },
  {
    id: '4',
    name: 'Limited Edition NFT',
    title: 'Limited Edition NFT',
    description: 'Claim this limited edition NFT to show your early membership in our community.',
    imageUrl: '/placeholder.svg',
    image_url: '/placeholder.svg',
    points_cost: 1000,
    pointsCost: 1000,
    type: 'nft',
    reward_type: 'digital', // Updated to match allowed type
    visibility: 'limited',
    stock: 5,
    quantity_available: 5,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    is_active: true,
    redeemCount: 3,
    community_id: 'default'
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
      name: rewardData.title || '',
      title: rewardData.title || '',
      description: rewardData.description || '',
      image_url: rewardData.imageUrl || undefined,
      imageUrl: rewardData.imageUrl || undefined,
      points_cost: rewardData.pointsCost || 0,
      pointsCost: rewardData.pointsCost || 0,
      type: rewardData.type || 'free',
      reward_type: rewardData.type as 'physical' | 'digital' | 'experience' || 'digital', // Cast to valid type
      visibility: rewardData.visibility || 'public',
      quantity_available: rewardData.stock !== undefined ? rewardData.stock : null,
      stock: rewardData.stock !== undefined ? rewardData.stock : null,
      expires_at: rewardData.expiresAt || null,
      expiresAt: rewardData.expiresAt || null,
      created_at: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      is_active: true,
      redeemCount: 0,
      actionUrl: rewardData.actionUrl,
      community_id: 'default'
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
