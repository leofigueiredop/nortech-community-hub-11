
import { Reward, Redemption } from '@/types/rewards';

export interface IPointsRepository {
  getUserPoints(userId: string): Promise<number>;
  addPoints(userId: string, points: number): Promise<number>;
  getRewards(): Promise<Reward[]>;
  redeemReward(userId: string, rewardId: string): Promise<Redemption>;
  getRedemptions(userId: string): Promise<Redemption[]>;
}
