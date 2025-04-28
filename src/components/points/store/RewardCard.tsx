
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Gift, Calendar, ShoppingCart, Award, Download, Key, Tag } from 'lucide-react';
import { useRewardRedeem } from '@/hooks/useRewardRedeem';
import { Reward } from '@/types/rewards';
import RedeemDialog from './RedeemDialog';

interface RewardCardProps {
  reward: Reward;
}

const RewardCard: React.FC<RewardCardProps> = ({ reward }) => {
  const { openRedeemDialog } = useRewardRedeem();
  
  // Get the reward type
  const rewardType = reward.type || reward.reward_type || 'free';
  
  const getRewardTypeIcon = () => {
    switch (rewardType) {
      case 'free':
      case 'digital':
        return <Gift className="h-4 w-4" />;
      case 'downloadable':
        return <Download className="h-4 w-4" />;
      case 'access':
        return <Key className="h-4 w-4" />;
      case 'nft':
      case 'experience':
        return <Award className="h-4 w-4" />;
      default:
        return <Tag className="h-4 w-4" />;
    }
  };
  
  const getRewardTypeLabel = () => {
    switch (rewardType) {
      case 'free':
        return 'Free';
      case 'downloadable':
        return 'Downloadable';
      case 'access':
        return 'Access';
      case 'nft':
        return 'NFT';
      case 'digital':
        return 'Digital';
      case 'experience':
        return 'Experience';
      default:
        return 'Other';
    }
  };
  
  const getVisibilityLabel = () => {
    switch (reward.visibility) {
      case 'public':
        return null; // No badge for public items
      case 'vip':
        return <Badge variant="secondary">VIP Only</Badge>;
      case 'limited':
        return <Badge variant="outline" className="border-amber-500 text-amber-500">Limited Time</Badge>;
      default:
        return null;
    }
  };

  // Use either imageUrl or image_url
  const imageUrl = reward.imageUrl || reward.image_url || '/placeholder.svg';
  // Use either title or name
  const title = reward.title || reward.name;
  // Use either pointsCost or points_cost
  const pointsCost = reward.pointsCost || reward.points_cost;
  // Use either expiresAt or expires_at
  const expiresAt = reward.expiresAt || reward.expires_at;
  // Use either stock or quantity_available
  const stock = reward.stock !== undefined ? reward.stock : reward.quantity_available;

  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow">
      <div 
        className="h-40 bg-cover bg-center" 
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <h3 className="font-bold">{title}</h3>
          {getVisibilityLabel()}
        </div>
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center">
                  {getRewardTypeIcon()}
                  <span className="ml-1">{getRewardTypeLabel()}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{getRewardTypeLabel()} reward</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {expiresAt && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4" />
                    <span className="ml-1">Expires soon</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Expires on {new Date(expiresAt).toLocaleDateString()}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">{reward.description}</p>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between items-center">
        <div className="font-bold text-purple-600 dark:text-purple-400">
          {pointsCost} Points
        </div>
        <Button 
          onClick={() => openRedeemDialog(reward)}
          size="sm"
          className="bg-purple-600 hover:bg-purple-700"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Redeem
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RewardCard;
