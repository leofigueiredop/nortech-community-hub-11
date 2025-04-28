
import { createClient } from '@supabase/supabase-js';
import { IPointsRepository } from '../interfaces/IPointsRepository';
import { Reward, Redemption } from '@/types/rewards';
import { BaseRepository } from './BaseRepository';

export class SupabasePointsRepository extends BaseRepository implements IPointsRepository {
  private supabase;

  constructor() {
    super();
    this.supabase = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    );
  }

  async getUserPoints(userId: string): Promise<number> {
    try {
      const { data, error } = await this.supabase
        .from('user_points')
        .select('points')
        .eq('user_id', userId)
        .single();
      
      if (error) throw error;
      return data?.points || 0;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async addPoints(userId: string, points: number): Promise<number> {
    try {
      const { data, error } = await this.supabase.rpc('add_points', {
        user_id: userId,
        points_to_add: points
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getRewards(): Promise<Reward[]> {
    try {
      const { data, error } = await this.supabase
        .from('rewards')
        .select('*');
      
      if (error) throw error;
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async redeemReward(userId: string, rewardId: string): Promise<Redemption> {
    try {
      const { data, error } = await this.supabase
        .from('redemptions')
        .insert([{ user_id: userId, reward_id: rewardId }])
        .select('*, reward:rewards(*)')
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getRedemptions(userId: string): Promise<Redemption[]> {
    try {
      const { data, error } = await this.supabase
        .from('redemptions')
        .select('*, reward:rewards(*)')
        .eq('user_id', userId);
      
      if (error) throw error;
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }
}
