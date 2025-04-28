
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { usePoints } from '@/context/PointsContext';
import { Reward } from '@/types/rewards';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface RedeemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  reward: Reward | null;
  onConfirm: () => void;
}

const RedeemDialog: React.FC<RedeemDialogProps> = ({ isOpen, onClose, reward, onConfirm }) => {
  const { toast } = useToast();
  const { totalPoints } = usePoints();
  
  if (!reward) return null;
  
  // Use either pointsCost or points_cost from the reward
  const rewardCost = reward.pointsCost || reward.points_cost;
  const canAfford = totalPoints >= rewardCost;
  
  // Use either stock or quantity_available from the reward
  const stockAvailable = reward.stock !== undefined ? reward.stock : reward.quantity_available;
  const isOutOfStock = stockAvailable !== null && stockAvailable !== undefined && stockAvailable <= 0;
  
  // Get the reward title or name
  const rewardTitle = reward.title || reward.name;
  
  const handleConfirm = () => {
    if (!canAfford) {
      toast({
        title: "Not enough points",
        description: `You need ${rewardCost - totalPoints} more points to redeem this reward.`,
        variant: "destructive",
      });
      return;
    }
    
    if (isOutOfStock) {
      toast({
        title: "Out of stock",
        description: "This reward is currently out of stock. Please check back later.",
        variant: "destructive",
      });
      return;
    }
    
    onConfirm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Redeem Reward</DialogTitle>
          <DialogDescription>
            Are you sure you want to redeem this reward?
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium">{rewardTitle}</h4>
            <span className="font-bold text-purple-600 dark:text-purple-400">{rewardCost} Points</span>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">{reward.description}</p>
          
          {stockAvailable !== null && stockAvailable !== undefined && (
            <div className="text-sm text-muted-foreground mt-2">
              Stock: {stockAvailable} remaining
            </div>
          )}
          
          <div className="flex items-start mt-4 p-3 rounded-md bg-muted">
            {canAfford ? (
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
            )}
            <div>
              <p className="text-sm font-medium">
                {canAfford ? 'You have enough points!' : 'Not enough points'}
              </p>
              <p className="text-sm text-muted-foreground">
                Your balance: {totalPoints} points
                {!canAfford && ` (Need ${rewardCost - totalPoints} more)`}
              </p>
            </div>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleConfirm}
            disabled={!canAfford || isOutOfStock}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Confirm Redemption
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RedeemDialog;
