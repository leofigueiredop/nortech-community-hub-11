
import { useState } from 'react';
import { Reward } from '@/types/rewards';
import { usePoints } from '@/context/PointsContext';
import { useToast } from '@/hooks/use-toast';

export const useRewardRedeem = () => {
  const [isRedeemDialogOpen, setIsRedeemDialogOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const { toast } = useToast();
  const { awardPoints, totalPoints } = usePoints();

  const openRedeemDialog = (reward: Reward) => {
    setSelectedReward(reward);
    setIsRedeemDialogOpen(true);
  };

  const closeRedeemDialog = () => {
    setIsRedeemDialogOpen(false);
    setSelectedReward(null);
  };

  const redeemReward = async () => {
    if (!selectedReward) return;

    if (totalPoints < selectedReward.pointsCost) {
      toast({
        title: "Not enough points",
        description: `You need ${selectedReward.pointsCost - totalPoints} more points to redeem this reward.`,
        variant: "destructive",
      });
      return;
    }

    try {
      // Simulate API call to redeem reward
      await new Promise(resolve => setTimeout(resolve, 800));

      // Deduct points
      awardPoints({
        type: 'course_completion', // Using this type temporarily as we don't have a redemption type
        description: `Redeemed: ${selectedReward.title}`,
        points: -selectedReward.pointsCost,
      });

      toast({
        title: "Reward Redeemed!",
        description: `You've successfully redeemed ${selectedReward.title}`,
      });

      closeRedeemDialog();
    } catch (error) {
      toast({
        title: "Redemption Failed",
        description: "There was an error processing your redemption. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    openRedeemDialog,
    closeRedeemDialog,
    redeemReward,
    isRedeemDialogOpen,
    selectedReward,
  };
};
