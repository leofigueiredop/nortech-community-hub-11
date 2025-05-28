import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { UserTier } from '@/types/subscription';
import { Crown, Star, User } from 'lucide-react';

const TierSwitcher: React.FC = () => {
  const { user, updateUser } = useAuth();
  
  if (!user) return null;
  
  const switchTier = (newTier: UserTier) => {
    console.log('🔄 TierSwitcher: Changing tier from', user?.tier, 'to', newTier);
    updateUser({ tier: newTier });
    console.log('✅ TierSwitcher: Tier updated to', newTier);
  };
  
  const getTierIcon = (tier: UserTier) => {
    switch (tier) {
      case 'mentor': return <Crown size={14} />;
      case 'premium': return <Star size={14} />;
      case 'free': return <User size={14} />;
    }
  };
  
  const getTierColor = (tier: UserTier) => {
    switch (tier) {
      case 'mentor': return 'bg-purple-600 hover:bg-purple-700';
      case 'premium': return 'bg-amber-600 hover:bg-amber-700';
      case 'free': return 'bg-green-600 hover:bg-green-700';
    }
  };
  
  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
      <div className="text-sm font-medium mb-2">Debug: User Tier</div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm">Current:</span>
        <Badge className={getTierColor(user.tier || 'free')}>
          {getTierIcon(user.tier || 'free')}
          <span className="ml-1 capitalize">{user.tier || 'free'}</span>
        </Badge>
      </div>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant={user.tier === 'free' ? 'default' : 'outline'}
          onClick={() => switchTier('free')}
          className="text-xs"
        >
          <User size={12} className="mr-1" />
          Free
        </Button>
        <Button
          size="sm"
          variant={user.tier === 'premium' ? 'default' : 'outline'}
          onClick={() => switchTier('premium')}
          className="text-xs"
        >
          <Star size={12} className="mr-1" />
          Premium
        </Button>
        <Button
          size="sm"
          variant={user.tier === 'mentor' ? 'default' : 'outline'}
          onClick={() => switchTier('mentor')}
          className="text-xs"
        >
          <Crown size={12} className="mr-1" />
          Mentor
        </Button>
      </div>
    </div>
  );
};

export default TierSwitcher; 