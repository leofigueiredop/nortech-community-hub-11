
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit, Trash2, Gift, Tag, Calendar } from 'lucide-react';
import { useRewardsAdmin } from '@/hooks/useRewardsAdmin';
import RewardFormDialog from './RewardFormDialog';
import { Reward } from '@/types/rewards';
import DeleteConfirmDialog from './DeleteConfirmDialog';

const RewardsManagement: React.FC = () => {
  const { rewards, deleteReward } = useRewardsAdmin();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [currentReward, setCurrentReward] = useState<Reward | null>(null);

  const handleEditReward = (reward: Reward) => {
    setCurrentReward(reward);
    setIsFormOpen(true);
  };

  const handleDeleteReward = (reward: Reward) => {
    setCurrentReward(reward);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (currentReward) {
      deleteReward(currentReward.id);
      setIsDeleteConfirmOpen(false);
    }
  };

  const getVisibilityBadge = (visibility: string) => {
    switch (visibility) {
      case 'public':
        return <Badge variant="secondary">Public</Badge>;
      case 'vip':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">VIP Only</Badge>;
      case 'limited':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">Limited Time</Badge>;
      default:
        return <Badge variant="secondary">Public</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'free':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Free</Badge>;
      case 'downloadable':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Downloadable</Badge>;
      case 'access':
        return <Badge variant="outline" className="bg-indigo-100 text-indigo-800 border-indigo-300">Access</Badge>;
      case 'nft':
        return <Badge variant="outline" className="bg-pink-100 text-pink-800 border-pink-300">NFT</Badge>;
      default:
        return <Badge variant="outline">Other</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Rewards Management</CardTitle>
          <CardDescription>
            Manage the rewards that users can redeem with their points
          </CardDescription>
        </div>
        <Button onClick={() => { setCurrentReward(null); setIsFormOpen(true); }}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Reward
        </Button>
      </CardHeader>
      <CardContent>
        {rewards.length === 0 ? (
          <div className="text-center py-8 space-y-3">
            <Gift className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="text-lg font-medium">No rewards yet</h3>
            <p className="text-muted-foreground mb-4">Create your first reward to start engaging your community</p>
            <Button 
              variant="outline" 
              onClick={() => { setCurrentReward(null); setIsFormOpen(true); }}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Your First Reward
            </Button>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reward</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Visibility</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rewards.map((reward) => (
                  <TableRow key={reward.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-8 h-8 rounded bg-cover bg-center"
                          style={{ backgroundImage: `url(${reward.imageUrl || '/placeholder.svg'})` }}
                        />
                        <span>{reward.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>{reward.pointsCost}</TableCell>
                    <TableCell>{getTypeBadge(reward.type)}</TableCell>
                    <TableCell>{getVisibilityBadge(reward.visibility)}</TableCell>
                    <TableCell>
                      {reward.stock === null ? (
                        <span className="text-muted-foreground">Unlimited</span>
                      ) : (
                        <span>{reward.stock}</span>
                      )}
                      {reward.expiresAt && (
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          Expires: {new Date(reward.expiresAt).toLocaleDateString()}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEditReward(reward)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteReward(reward)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {isFormOpen && (
          <RewardFormDialog 
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            reward={currentReward}
          />
        )}

        {isDeleteConfirmOpen && (
          <DeleteConfirmDialog
            isOpen={isDeleteConfirmOpen}
            onClose={() => setIsDeleteConfirmOpen(false)}
            onConfirm={confirmDelete}
            title="Delete Reward"
            description={`Are you sure you want to delete "${currentReward?.title}"? This action cannot be undone.`}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default RewardsManagement;
