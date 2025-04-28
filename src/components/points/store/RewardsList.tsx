
import React from 'react';
import { useRewards } from '@/hooks/useRewards';
import RewardCard from './RewardCard';

interface RewardsListProps {
  searchQuery: string;
  categoryFilter: string;
  sortBy: string;
}

const RewardsList: React.FC<RewardsListProps> = ({ searchQuery, categoryFilter, sortBy }) => {
  const { rewards, isLoading } = useRewards();
  
  // Filter rewards based on search query and type
  const filteredRewards = rewards.filter(reward => {
    const rewardName = reward.title || reward.name || '';
    const rewardDesc = reward.description || '';
    
    const matchesSearch = searchQuery === '' || 
      rewardName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rewardDesc.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Get reward type from either type or reward_type property
    const rewardType = reward.type || reward.reward_type || '';
    const matchesCategory = categoryFilter === 'all' || rewardType === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });
  
  // Sort rewards based on sortBy
  const sortedRewards = [...filteredRewards].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        const aDate = new Date(a.createdAt || a.created_at).getTime();
        const bDate = new Date(b.createdAt || b.created_at).getTime();
        return bDate - aDate;
      case 'price-low':
        const aCost = a.pointsCost || a.points_cost;
        const bCost = b.pointsCost || b.points_cost;
        return aCost - bCost;
      case 'price-high':
        const aCostHigh = a.pointsCost || a.points_cost;
        const bCostHigh = b.pointsCost || b.points_cost;
        return bCostHigh - aCostHigh;
      case 'popular':
      default:
        return (b.redeemCount || 0) - (a.redeemCount || 0);
    }
  });

  if (isLoading) {
    return <div className="text-center py-10">Loading rewards...</div>;
  }

  if (sortedRewards.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No rewards found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {sortedRewards.map(reward => (
        <RewardCard key={reward.id} reward={reward} />
      ))}
    </div>
  );
};

export default RewardsList;
