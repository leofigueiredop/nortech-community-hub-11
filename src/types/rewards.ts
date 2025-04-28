
export interface Reward {
  id: string;
  community_id: string;
  name: string;
  title?: string; // Added for UI components
  description?: string;
  image_url?: string;
  imageUrl?: string; // Added for UI components
  points_cost: number;
  pointsCost?: number; // Added for UI components
  is_active: boolean;
  quantity_available?: number;
  stock?: number; // Added for UI components
  created_at: string;
  createdAt?: string; // Added for UI components
  expires_at?: string;
  expiresAt?: string; // Added for UI components
  redemption_instructions?: string;
  reward_type?: 'physical' | 'digital' | 'experience';
  type?: string; // Added for UI components 
  visibility?: string; // Added for UI components
  redeemCount?: number; // Added for UI components
  actionUrl?: string; // Added for UI components
}

export interface Redemption {
  id: string;
  user_id: string;
  reward_id: string;
  redeemed_at: string;
  createdAt?: string; // Added for UI components
  created_at?: string; // Added to support both formats
  status: 'pending' | 'fulfilled' | 'cancelled' | 'expired' | 'completed';
  fulfillment_details?: {
    delivery_info?: any;
    notes?: string;
    fulfillment_date?: string;
    code?: string;
    [key: string]: any;
  };
  community_id: string;
  reward?: Reward;
  points_spent?: number; // Added for UI components
  pointsSpent?: number; // Added for UI components
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
