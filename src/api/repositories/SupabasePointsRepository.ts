
import { BaseRepository } from './BaseRepository';
import { IPointsRepository } from '../interfaces/IPointsRepository';
import { PointsActivity, PointsRedemption } from '@/types/points';

export class SupabasePointsRepository extends BaseRepository implements IPointsRepository {
  async getUserPoints(userId: string): Promise<number> {
    try {
      const { data, error } = await this.supabase
        .from('user_points')
        .select('total_points')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      
      return data?.total_points || 0;
    } catch (error) {
      console.error('Error fetching user points:', error);
      return 0;
    }
  }

  async addPoints(userId: string, points: number, activityType: string, entityId?: string): Promise<boolean> {
    try {
      // Start a transaction
      const { data, error } = await this.supabase.rpc('add_points', {
        p_user_id: userId,
        p_points: points,
        p_activity_type: activityType,
        p_entity_id: entityId || null,
        p_community_id: this.communityId || null
      });

      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error adding points:', error);
      return false;
    }
  }

  async getPointsHistory(userId: string, limit = 10, offset = 0): Promise<PointsActivity[]> {
    try {
      const { data, error } = await this.supabase
        .from('points_activities')
        .select('*')
        .eq('user_id', userId)
        .eq('community_id', this.communityId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching points history:', error);
      return [];
    }
  }

  async redeemPoints(userId: string, rewardId: string, pointsCost: number): Promise<boolean> {
    try {
      // First check if user has enough points
      const userPoints = await this.getUserPoints(userId);
      
      if (userPoints < pointsCost) {
        throw new Error('Not enough points for redemption');
      }
      
      // Start a transaction
      const { data, error } = await this.supabase.rpc('redeem_points', {
        p_user_id: userId,
        p_reward_id: rewardId,
        p_points_cost: pointsCost,
        p_community_id: this.communityId || null
      });

      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error redeeming points:', error);
      return false;
    }
  }
  
  async getRedemptions(userId: string, limit = 10, offset = 0): Promise<PointsRedemption[]> {
    try {
      const { data, error } = await this.supabase
        .from('points_redemptions')
        .select('*, rewards(*)')
        .eq('user_id', userId)
        .eq('community_id', this.communityId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching redemption history:', error);
      return [];
    }
  }
}
