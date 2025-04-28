
export interface PointsActivity {
  id: string;
  user_id: string;
  community_id: string;
  points: number;
  activity_type: string;
  entity_id?: string;
  entity_type?: string;
  created_at: string;
  metadata?: Record<string, any>;
}

export interface PointsReward {
  id: string;
  community_id: string;
  name: string;
  description?: string;
  points_cost: number;
  image_url?: string;
  reward_type: 'digital' | 'physical' | 'access' | 'discount';
  quantity_available?: number;
  is_active: boolean;
  redemption_instructions?: string;
  created_at: string;
  updated_at: string;
}

export interface PointsRedemption {
  id: string;
  user_id: string;
  community_id: string;
  reward_id: string;
  points_spent: number;
  status: 'pending' | 'completed' | 'cancelled' | 'failed';
  created_at: string;
  updated_at: string;
  rewards?: PointsReward;
}

export interface PointsSettings {
  id: string;
  community_id: string;
  activity_rewards: Record<string, number>;
  redemption_enabled: boolean;
  welcome_bonus: number;
  referral_bonus: number;
  created_at: string;
  updated_at: string;
}
