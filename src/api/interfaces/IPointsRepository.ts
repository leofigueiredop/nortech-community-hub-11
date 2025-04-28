
import { Reward, Redemption, PointsTransaction } from '@/types/rewards';

export interface IPointsRepository {
  getUserPoints(userId: string): Promise<number>;
  addPoints(userId: string, points: number, source: string, description: string): Promise<number>;
  getPointsHistory(userId: string): Promise<PointsTransaction[]>;
  getRewards(): Promise<Reward[]>;
  getRewardById(rewardId: string): Promise<Reward>;
  createReward(reward: Partial<Reward>): Promise<Reward>;
  updateReward(rewardId: string, reward: Partial<Reward>): Promise<Reward>;
  deleteReward(rewardId: string): Promise<void>;
  redeemReward(userId: string, rewardId: string): Promise<Redemption>;
  getRedemptions(userId: string): Promise<Redemption[]>;
  updateRedemptionStatus(redemptionId: string, status: string, details?: any): Promise<Redemption>;
  getLeaderboard(limit?: number): Promise<{ user_id: string; points: number; name: string; avatar_url?: string; }[]>;
}
