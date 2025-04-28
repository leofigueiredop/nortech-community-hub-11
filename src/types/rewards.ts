
export interface Reward {
  id: string;
  community_id: string;
  name: string;
  description?: string;
  image_url?: string;
  points_cost: number;
  is_active: boolean;
  quantity_available?: number;
  created_at: string;
  expires_at?: string;
  redemption_instructions?: string;
  reward_type?: 'physical' | 'digital' | 'experience';
}

export interface Redemption {
  id: string;
  user_id: string;
  reward_id: string;
  redeemed_at: string;
  status: 'pending' | 'fulfilled' | 'cancelled' | 'expired';
  fulfillment_details?: {
    delivery_info?: any;
    notes?: string;
    fulfillment_date?: string;
    code?: string;
    [key: string]: any;
  };
  community_id: string;
  reward?: Reward;
}

export interface PointsTransaction {
  id: string;
  user_id: string;
  community_id: string;
  points: number;
  source: string;
  description: string;
  created_at: string;
  reference_id?: string;
  reference_type?: string;
}
