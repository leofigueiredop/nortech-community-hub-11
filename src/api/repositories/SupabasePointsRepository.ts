
import { IPointsRepository } from '../interfaces/IPointsRepository';
import { BaseRepository } from './BaseRepository';
import { PointsTransaction, Reward, Redemption } from '@/types/rewards';

export class SupabasePointsRepository extends BaseRepository implements IPointsRepository {
  async getUserPoints(userId: string): Promise<number> {
    try {
      await this.setTenantContext();

      const { data, error } = await this.supabase
        .from('points_transactions')
        .select('points')
        .eq('community_id', this.currentCommunityId)
        .eq('user_id', userId);

      if (error) throw error;

      if (!data || data.length === 0) return 0;

      return data.reduce((total: number, transaction: { points: number }) => {
        return total + transaction.points;
      }, 0);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getUserTransactions(userId: string): Promise<PointsTransaction[]> {
    try {
      await this.setTenantContext();

      const { data, error } = await this.supabase
        .from('points_transactions')
        .select('*')
        .eq('community_id', this.currentCommunityId)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as PointsTransaction[];
    } catch (error) {
      return this.handleError(error);
    }
  }

  async recordTransaction(transaction: Partial<PointsTransaction>): Promise<PointsTransaction> {
    try {
      await this.setTenantContext();

      const { data, error } = await this.supabase
        .from('points_transactions')
        .insert([{
          community_id: this.currentCommunityId,
          ...transaction,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return data as PointsTransaction;
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
        .eq('community_id', this.currentCommunityId)
        .eq('is_active', true)
        .order('points_cost', { ascending: true });

      if (error) throw error;
      return data as Reward[];
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
        .eq('community_id', this.currentCommunityId)
        .eq('id', rewardId)
        .single();

      if (error) throw error;
      return data as Reward;
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
          community_id: this.currentCommunityId,
          ...reward,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return data as Reward;
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
        .eq('community_id', this.currentCommunityId)
        .eq('id', rewardId)
        .select()
        .single();

      if (error) throw error;
      return data as Reward;
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
        .eq('community_id', this.currentCommunityId)
        .eq('id', rewardId);

      if (error) throw error;
    } catch (error) {
      this.handleError(error);
    }
  }

  async redeemReward(userId: string, rewardId: string): Promise<Redemption> {
    try {
      await this.setTenantContext();

      // Start by getting the reward and user points
      const reward = await this.getRewardById(rewardId);
      const userPoints = await this.getUserPoints(userId);

      // Check if user has enough points
      if (userPoints < reward.points_cost) {
        throw new Error('Not enough points to redeem this reward');
      }

      // Check if reward has quantity limit
      if (reward.quantity_available !== undefined && reward.quantity_available <= 0) {
        throw new Error('This reward is out of stock');
      }

      // Begin transaction
      const { data: redemptionData, error: redemptionError } = await this.supabase
        .from('redemptions')
        .insert([{
          user_id: userId,
          reward_id: rewardId,
          redeemed_at: new Date().toISOString(),
          status: 'pending',
          community_id: this.currentCommunityId
        }])
        .select()
        .single();

      if (redemptionError) throw redemptionError;

      // Deduct points
      await this.recordTransaction({
        user_id: userId,
        points: -reward.points_cost,
        source: 'redemption',
        description: `Redeemed: ${reward.name}`,
        reference_id: redemptionData.id,
        reference_type: 'redemption'
      });

      // Update reward quantity if applicable
      if (reward.quantity_available !== undefined) {
        await this.updateReward(rewardId, {
          quantity_available: reward.quantity_available - 1
        });
      }

      return redemptionData as Redemption;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getUserRedemptions(userId: string): Promise<Redemption[]> {
    try {
      await this.setTenantContext();

      const { data, error } = await this.supabase
        .from('redemptions')
        .select(`
          *,
          reward:reward_id (*)
        `)
        .eq('community_id', this.currentCommunityId)
        .eq('user_id', userId)
        .order('redeemed_at', { ascending: false });

      if (error) throw error;
      return data as Redemption[];
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateRedemptionStatus(redemptionId: string, status: 'pending' | 'fulfilled' | 'cancelled' | 'expired', details?: any): Promise<Redemption> {
    try {
      await this.setTenantContext();

      const updateData: any = { status };
      if (details) {
        updateData.fulfillment_details = details;
      }

      const { data, error } = await this.supabase
        .from('redemptions')
        .update(updateData)
        .eq('community_id', this.currentCommunityId)
        .eq('id', redemptionId)
        .select()
        .single();

      if (error) throw error;
      return data as Redemption;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getLeaderboard(limit: number = 10): Promise<any[]> {
    try {
      await this.setTenantContext();

      // Get sum of points by user
      const { data: pointsData, error: pointsError } = await this.supabase.rpc(
        'get_community_leaderboard',
        { 
          p_community_id: this.currentCommunityId,
          p_limit: limit 
        }
      );

      if (pointsError) throw pointsError;

      // Get user profiles for these users
      if (!pointsData || pointsData.length === 0) return [];

      const userIds = pointsData.map((item: any) => item.user_id);

      const { data: userData, error: userError } = await this.supabase
        .from('profiles')
        .select('id, name, avatar_url')
        .in('id', userIds);

      if (userError) throw userError;

      // Combine the data
      return pointsData.map((pointsItem: any) => {
        const user = userData.find((u: any) => u.id === pointsItem.user_id);
        return {
          user_id: pointsItem.user_id,
          points: pointsItem.total_points,
          name: user ? user.name : 'Unknown User',
          avatar_url: user ? user.avatar_url : null
        };
      });
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getPointsSettings(): Promise<any> {
    try {
      await this.setTenantContext();

      const { data, error } = await this.supabase
        .from('community_settings')
        .select('settings_data')
        .eq('community_id', this.currentCommunityId)
        .eq('settings_type', 'points_config')
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
      
      return data?.settings_data || {
        enabled: true,
        actionPoints: {
          login: 5,
          contentView: 1,
          contentComplete: 10,
          courseComplete: 50,
          eventAttend: 20,
          postCreate: 10,
          commentCreate: 5
        },
        dailyCaps: {
          login: 5,
          contentView: 10,
          contentComplete: 50,
          postCreate: 30,
          commentCreate: 20
        }
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updatePointsSettings(settings: any): Promise<any> {
    try {
      await this.setTenantContext();

      // Check if settings exist
      const { data: existingData } = await this.supabase
        .from('community_settings')
        .select('id')
        .eq('community_id', this.currentCommunityId)
        .eq('settings_type', 'points_config')
        .single();
      
      let result;
      if (existingData) {
        // Update existing settings
        const { data, error } = await this.supabase
          .from('community_settings')
          .update({ settings_data: settings })
          .eq('id', existingData.id)
          .select('settings_data')
          .single();
        
        if (error) throw error;
        result = data;
      } else {
        // Create new settings
        const { data, error } = await this.supabase
          .from('community_settings')
          .insert([{
            community_id: this.currentCommunityId,
            settings_type: 'points_config',
            settings_data: settings
          }])
          .select('settings_data')
          .single();
        
        if (error) throw error;
        result = data;
      }
      
      return result.settings_data;
    } catch (error) {
      return this.handleError(error);
    }
  }
}
