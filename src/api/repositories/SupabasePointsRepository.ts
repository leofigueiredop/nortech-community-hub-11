
import { createClient } from '@supabase/supabase-js';
import { IPointsRepository } from '../interfaces/IPointsRepository';
import { Reward, Redemption, PointsTransaction } from '@/types/rewards';
import { BaseRepository } from './BaseRepository';
import { supabaseConfig } from '../ApiClient';

export class SupabasePointsRepository extends BaseRepository implements IPointsRepository {
  constructor() {
    super();
  }

  async getUserPoints(userId: string): Promise<number> {
    try {
      await this.setTenantContext();
      const { data, error } = await this.supabase
        .from('user_points')
        .select('points')
        .eq('user_id', userId)
        .eq('community_id', this.currentCommunityId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data?.points || 0;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async addPoints(
    userId: string, 
    points: number, 
    source: string, 
    description: string
  ): Promise<number> {
    try {
      await this.setTenantContext();
      
      // First, record the transaction
      const { error: txError } = await this.supabase
        .from('points_transactions')
        .insert([{
          user_id: userId,
          community_id: this.currentCommunityId,
          points: points,
          source: source,
          description: description
        }]);
      
      if (txError) throw txError;
      
      // Then, update the user's points
      const { data, error } = await this.supabase.rpc('add_points', {
        user_id: userId,
        community_id: this.currentCommunityId,
        points_to_add: points
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getPointsHistory(userId: string): Promise<PointsTransaction[]> {
    try {
      await this.setTenantContext();
      const { data, error } = await this.supabase
        .from('points_transactions')
        .select('*')
        .eq('user_id', userId)
        .eq('community_id', this.currentCommunityId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getRewards(): Promise<Reward[]> {
    try {
      await this.setTenantContext();
      const { data, error } = await this.supabase
        .from('rewards')
        .select('*')
        .eq('community_id', this.currentCommunityId);
      
      if (error) throw error;
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getRewardById(rewardId: string): Promise<Reward> {
    try {
      await this.setTenantContext();
      const { data, error } = await this.supabase
        .from('rewards')
        .select('*')
        .eq('id', rewardId)
        .eq('community_id', this.currentCommunityId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async createReward(reward: Partial<Reward>): Promise<Reward> {
    try {
      await this.setTenantContext();
      const { data, error } = await this.supabase
        .from('rewards')
        .insert([{
          ...reward,
          community_id: this.currentCommunityId
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateReward(rewardId: string, reward: Partial<Reward>): Promise<Reward> {
    try {
      await this.setTenantContext();
      const { data, error } = await this.supabase
        .from('rewards')
        .update(reward)
        .eq('id', rewardId)
        .eq('community_id', this.currentCommunityId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deleteReward(rewardId: string): Promise<void> {
    try {
      await this.setTenantContext();
      const { error } = await this.supabase
        .from('rewards')
        .delete()
        .eq('id', rewardId)
        .eq('community_id', this.currentCommunityId);
      
      if (error) throw error;
    } catch (error) {
      this.handleError(error);
    }
  }

  async redeemReward(userId: string, rewardId: string): Promise<Redemption> {
    try {
      await this.setTenantContext();
      
      // Get reward details first to check if available
      const { data: reward, error: rewardError } = await this.supabase
        .from('rewards')
        .select('*')
        .eq('id', rewardId)
        .single();
      
      if (rewardError) throw rewardError;
      
      // Check if user has enough points
      const userPoints = await this.getUserPoints(userId);
      
      if (userPoints < reward.points_cost) {
        throw new Error("Not enough points to redeem this reward");
      }
      
      // Check if reward quantity is available
      if (reward.quantity_available !== null && reward.quantity_available <= 0) {
        throw new Error("This reward is out of stock");
      }
      
      // Create redemption record
      const { data, error } = await this.supabase
        .from('redemptions')
        .insert([{
          user_id: userId,
          reward_id: rewardId,
          community_id: this.currentCommunityId,
          status: 'pending'
        }])
        .select('*, reward:rewards(*)')
        .single();
      
      if (error) throw error;
      
      // Deduct points
      await this.addPoints(
        userId, 
        -reward.points_cost, 
        'reward_redemption', 
        `Redeemed reward: ${reward.name}`
      );
      
      // Update reward quantity if applicable
      if (reward.quantity_available !== null) {
        await this.supabase
          .from('rewards')
          .update({ quantity_available: reward.quantity_available - 1 })
          .eq('id', rewardId);
      }
      
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getRedemptions(userId: string): Promise<Redemption[]> {
    try {
      await this.setTenantContext();
      const { data, error } = await this.supabase
        .from('redemptions')
        .select('*, reward:rewards(*)')
        .eq('user_id', userId)
        .eq('community_id', this.currentCommunityId)
        .order('redeemed_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateRedemptionStatus(redemptionId: string, status: string, details?: any): Promise<Redemption> {
    try {
      await this.setTenantContext();
      const { data, error } = await this.supabase
        .from('redemptions')
        .update({
          status,
          fulfillment_details: details || {}
        })
        .eq('id', redemptionId)
        .select('*, reward:rewards(*)')
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getLeaderboard(limit: number = 10): Promise<{ user_id: string; points: number; name: string; avatar_url?: string; }[]> {
    try {
      await this.setTenantContext();
      const { data, error } = await this.supabase
        .from('user_points')
        .select('user_id, points, profiles:profiles(name, avatar_url)')
        .eq('community_id', this.currentCommunityId)
        .order('points', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      
      return data.map(item => ({
        user_id: item.user_id,
        points: item.points,
        name: item.profiles?.name || 'Unknown User',
        avatar_url: item.profiles?.avatar_url
      }));
    } catch (error) {
      return this.handleError(error);
    }
  }
}
