
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
  
  // Filter rewards based on search query and category
  const filteredRewards = rewards.filter(reward => {
    const matchesSearch = searchQuery === '' || 
      reward.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reward.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || reward.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });
  
  // Sort rewards based on sortBy
  const sortedRewards = [...filteredRewards].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'price-low':
        return a.pointsCost - b.pointsCost;
      case 'price-high':
        return b.pointsCost - a.pointsCost;
      case 'popular':
      default:
        return b.redeemCount - a.redeemCount;
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
