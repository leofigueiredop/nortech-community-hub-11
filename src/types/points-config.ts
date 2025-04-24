
export type PointTemplateType = 'educational' | 'social' | 'gaming';

export interface PointTemplate {
  id: string;
  name: string;
  description: string;
  type: PointTemplateType;
  icon: React.ReactNode;
  recommendedFor: string;
  pointValues: Record<string, number>;
  caps: {
    daily: Record<string, number>;
    weekly: Record<string, number>;
    monthly: Record<string, number>;
  };
}

export type ActionCategory = 'engagement' | 'education' | 'social';

export interface PointAction {
  id: string;
  name: string;
  description: string;
  defaultPoints: number;
  category: ActionCategory;
  icon?: React.ReactNode;
}

export interface PointsCap {
  actionId: string;
  limit: number;
}

export interface RewardCategory {
  id: string;
  name: string;
  description?: string;
}

export type RewardVisibility = 'public' | 'vip' | 'limited';
export type RewardType = 'digital' | 'nft' | 'badge' | 'access' | 'physical';

export interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  type: RewardType;
  visibility: RewardVisibility;
  stock?: number;
  imageUrl?: string;
  actionUrl?: string;
  expiresAt?: Date;
  createdAt: Date;
  redeemCount: number;
  isActive: boolean;
  categoryId?: string;
}

export interface RewardForm {
  id?: string;
  name: string;
  description: string;
  pointsCost: number;
  type: RewardType;
  visibility: RewardVisibility;
  stock?: number | null;
  imageUrl?: string;
  actionUrl?: string;
  expiresAt?: Date | string | null;
  isActive?: boolean;
}
