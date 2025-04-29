import { ApiClient } from '@/api/ApiClient';
import { PointsActivity, PointsSettings } from '@/types/points';
import { POINTS_VALUES } from '@/context/PointsContext';

export class PointsService {
  private static instance: PointsService;
  private api: ApiClient;
  private settings: PointsSettings | null = null;

  private constructor() {
    this.api = ApiClient.getInstance();
  }

  public static getInstance(): PointsService {
    if (!PointsService.instance) {
      PointsService.instance = new PointsService();
    }
    return PointsService.instance;
  }

  // Initialize settings for the current community
  public async initializeSettings(communityId: string): Promise<void> {
    try {
      const { data: settings } = await this.api.supabase
        .from('points_settings')
        .select('*')
        .eq('community_id', communityId)
        .single();

      if (settings) {
        this.settings = settings;
      } else {
        // Create default settings if none exist
        const defaultSettings = {
          community_id: communityId,
          activity_rewards: POINTS_VALUES,
          redemption_enabled: true,
          welcome_bonus: 10,
          referral_bonus: 25
        };

        const { data: newSettings } = await this.api.supabase
          .from('points_settings')
          .insert(defaultSettings)
          .select()
          .single();

        this.settings = newSettings;
      }
    } catch (error) {
      console.error('Error initializing points settings:', error);
      throw error;
    }
  }

  // Get points for a specific action
  private getPointsForAction(actionType: string): number {
    if (!this.settings) {
      return POINTS_VALUES[actionType as keyof typeof POINTS_VALUES] || 0;
    }
    return this.settings.activity_rewards[actionType] || 0;
  }

  // Award points for an action
  public async awardPoints(
    userId: string,
    actionType: string,
    entityId?: string,
    metadata?: Record<string, any>
  ): Promise<boolean> {
    try {
      const points = this.getPointsForAction(actionType);
      if (points <= 0) return false;

      const success = await this.api.points.addPoints(
        userId,
        points,
        actionType,
        entityId
      );

      if (success) {
        // Emit real-time update
        await this.api.supabase
          .from('points_activities')
          .insert({
            user_id: userId,
            points,
            activity_type: actionType,
            entity_id: entityId,
            entity_type: entityId ? actionType.split('_')[0] : null,
            metadata
          });
      }

      return success;
    } catch (error) {
      console.error('Error awarding points:', error);
      return false;
    }
  }

  // Get user's points history
  public async getPointsHistory(
    userId: string,
    limit: number = 10,
    offset: number = 0
  ): Promise<PointsActivity[]> {
    return this.api.points.getPointsHistory(userId, limit, offset);
  }

  // Get user's current points balance
  public async getUserPoints(userId: string): Promise<number> {
    return this.api.points.getUserPoints(userId);
  }

  // Update points configuration
  public async updatePointsConfig(
    communityId: string,
    config: Partial<PointsSettings>
  ): Promise<void> {
    try {
      const { data: updatedSettings } = await this.api.supabase
        .from('points_settings')
        .update(config)
        .eq('community_id', communityId)
        .select()
        .single();

      if (updatedSettings) {
        this.settings = updatedSettings;
      }
    } catch (error) {
      console.error('Error updating points configuration:', error);
      throw error;
    }
  }

  // Apply points template
  public async applyPointsTemplate(
    communityId: string,
    template: {
      pointValues: Record<string, number>;
      caps: {
        daily: Record<string, number>;
        weekly: Record<string, number>;
        monthly: Record<string, number>;
      };
    }
  ): Promise<void> {
    await this.updatePointsConfig(communityId, {
      activity_rewards: template.pointValues
    });
  }

  // Check if user has reached daily/weekly/monthly caps
  public async checkPointsCap(
    userId: string,
    actionType: string,
    period: 'daily' | 'weekly' | 'monthly' = 'daily'
  ): Promise<boolean> {
    if (!this.settings) return false;

    try {
      let startDate = new Date();
      if (period === 'weekly') {
        startDate.setDate(startDate.getDate() - 7);
      } else if (period === 'monthly') {
        startDate.setMonth(startDate.getMonth() - 1);
      } else {
        startDate.setHours(0, 0, 0, 0);
      }

      const { data: activities } = await this.api.supabase
        .from('points_activities')
        .select('points')
        .eq('user_id', userId)
        .eq('activity_type', actionType)
        .gte('created_at', startDate.toISOString());

      if (!activities) return false;

      const totalPoints = activities.reduce((sum, activity) => sum + activity.points, 0);
      const cap = this.settings.caps?.[period]?.[actionType];

      return cap ? totalPoints >= cap : false;
    } catch (error) {
      console.error('Error checking points cap:', error);
      return false;
    }
  }
} 