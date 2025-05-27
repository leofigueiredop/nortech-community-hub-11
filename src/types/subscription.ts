export type UserTier = 'free' | 'premium' | 'mentor';

export interface UserSubscription {
  id: string;
  user_id: string;
  community_id: string;
  tier: UserTier;
  status: 'active' | 'inactive' | 'cancelled' | 'expired';
  started_at: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface SpaceAccess {
  space: string;
  requiredTier: UserTier;
  isAccessible: (userTier: UserTier) => boolean;
}

// Define space access levels
export const SPACE_ACCESS: Record<string, SpaceAccess> = {
  'General Discussion': {
    space: 'General Discussion',
    requiredTier: 'free',
    isAccessible: () => true
  },
  'Free Group': {
    space: 'Free Group', 
    requiredTier: 'free',
    isAccessible: () => true
  },
  'Premium Group': {
    space: 'Premium Group',
    requiredTier: 'premium',
    isAccessible: (userTier) => userTier === 'premium' || userTier === 'mentor'
  },
  'Mentorship Circle': {
    space: 'Mentorship Circle',
    requiredTier: 'mentor',
    isAccessible: (userTier) => userTier === 'mentor'
  },
  'Announcements': {
    space: 'Announcements',
    requiredTier: 'free',
    isAccessible: () => true
  }
};

// Helper function to check if user can access a space
export const canAccessSpace = (space: string, userTier: UserTier): boolean => {
  const spaceAccess = SPACE_ACCESS[space];
  if (!spaceAccess) return true; // Default to accessible if space not defined
  return spaceAccess.isAccessible(userTier);
};

// Helper function to get tier hierarchy level
export const getTierLevel = (tier: UserTier): number => {
  switch (tier) {
    case 'free': return 1;
    case 'premium': return 2;
    case 'mentor': return 3;
    default: return 1;
  }
};

// Helper function to check if content should be blurred
export const shouldBlurContent = (contentTier: UserTier, userTier: UserTier): boolean => {
  return getTierLevel(contentTier) > getTierLevel(userTier);
}; 