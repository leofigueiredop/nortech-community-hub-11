
import { createClient } from '@/api/supabase';
import { IPointsRepository } from '@/api/interfaces/IPointsRepository';
import { PointsActivity, PointsRedemption } from '@/types/points';

export class SupabasePointsRepository implements IPointsRepository {
  private supabase = createClient();
  private communityId: string;

  constructor(communityId: string = 'default') {
    this.communityId = communityId;
  }

  async getUserPoints(userId: string): Promise<number> {
    try {
      // First try to get the user's points directly
      const { data: userPoints, error: userPointsError } = await this.supabase
        .from('user_profiles')
        .select('points')
        .eq('user_id', userId)
        .single();

      if (userPointsError) throw userPointsError;

      if (userPoints && userPoints.points !== undefined) {
        return userPoints.points;
      }

      // If user profile doesn't have points or doesn't exist, calculate from activity
      const { data: activities, error } = await this.supabase
        .from('points_activities')
        .select('points')
        .eq('user_id', userId)
        .eq('community_id', this.communityId);

      if (error) throw error;

      return activities.reduce((sum, activity) => sum + activity.points, 0);
    } catch (error) {
      console.error("Error getting user points:", error);
      return 0;
    }
  }

  async addPoints(userId: string, points: number, activityType: string, entityId?: string): Promise<boolean> {
    try {
      const { data, error } = await this.supabase
        .from('points_activities')
        .insert({
          user_id: userId,
          community_id: this.communityId,
          points: points,
          activity_type: activityType,
          entity_id: entityId || null,
          entity_type: entityId ? activityType.split('_')[0] : null,
          created_at: new Date().toISOString(),
        });

      if (error) throw error;

      // Also update the total points in the user profile
      const { data: userData, error: userError } = await this.supabase
        .rpc('increment_user_points', { 
          user_id_param: userId, 
          points_param: points 
        });

      if (userError) throw userError;

      return true;
    } catch (error) {
      console.error("Error adding points:", error);
      return false;
    }
  }

  async getPointsHistory(userId: string, limit: number = 10, offset: number = 0): Promise<PointsActivity[]> {
    try {
      const { data, error } = await this.supabase
        .from('points_activities')
        .select('*')
        .eq('user_id', userId)
        .eq('community_id', this.communityId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return data as PointsActivity[];
    } catch (error) {
      console.error("Error getting points history:", error);
      return [];
    }
  }

  async redeemPoints(userId: string, rewardId: string, pointsCost: number): Promise<boolean> {
    try {
      // Start a transaction
      const { data: userData, error: userPointsError } = await this.supabase
        .from('user_profiles')
        .select('points')
        .eq('user_id', userId)
        .single();

      if (userPointsError) throw userPointsError;

      // Check if user has enough points
      if (userData.points < pointsCost) {
        throw new Error('Not enough points');
      }

      // Create the redemption record
      const { data: redemption, error: redemptionError } = await this.supabase
        .from('points_redemptions')
        .insert({
          user_id: userId,
          community_id: this.communityId,
          reward_id: rewardId,
          points_spent: pointsCost,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (redemptionError) throw redemptionError;

      // Deduct points from user
      const { data: updatedUser, error: updateError } = await this.supabase
        .rpc('decrement_user_points', { 
          user_id_param: userId, 
          points_param: pointsCost 
        });

      if (updateError) throw updateError;

      return true;
    } catch (error) {
      console.error("Error redeeming points:", error);
      return false;
    }
  }

  async getRedemptions(userId: string, limit: number = 10, offset: number = 0): Promise<PointsRedemption[]> {
    try {
      const { data, error } = await this.supabase
        .from('points_redemptions')
        .select(`
          *,
          rewards:reward_id (*)
        `)
        .eq('user_id', userId)
        .eq('community_id', this.communityId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return data as PointsRedemption[];
    } catch (error) {
      console.error("Error getting redemption history:", error);
      return [];
    }
  }
}
