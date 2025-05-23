
import { PointsActivity, PointsRedemption } from '@/types/points';

export interface IPointsRepository {
  getUserPoints(userId: string): Promise<number>;
  addPoints(userId: string, points: number, activityType: string, entityId?: string): Promise<boolean>;
  getPointsHistory(userId: string, limit?: number, offset?: number): Promise<PointsActivity[]>;
  redeemPoints(userId: string, rewardId: string, pointsCost: number): Promise<boolean>;
  getRedemptions(userId: string, limit?: number, offset?: number): Promise<PointsRedemption[]>;
}
