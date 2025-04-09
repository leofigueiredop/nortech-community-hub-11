
export interface Reward {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  pointsCost: number;
  type: 'free' | 'downloadable' | 'access' | 'nft';
  visibility: 'public' | 'vip' | 'limited';
  stock: number | null;
  expiresAt: string | null;
  createdAt: string;
  redeemCount: number;
  actionUrl?: string;
}

export interface Redemption {
  id: string;
  userId: string;
  rewardId: string;
  pointsSpent: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
  reward: Reward;
}
