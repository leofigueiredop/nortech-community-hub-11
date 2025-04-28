
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Copy, Eye, Archive } from 'lucide-react';
import { useRewardsAdmin } from '@/hooks/useRewardsAdmin';
import { RewardType, RewardVisibility, RewardForm } from '@/types/points-config';
import RewardFormDialog from './RewardFormDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Reward } from '@/types/rewards';
import { toast } from 'sonner';

// Reward type icons and colors
const rewardTypeInfo: Record<string, { color: string, label: string }> = {
  digital: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300', label: 'Digital' },
  nft: { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300', label: 'NFT' },
  badge: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300', label: 'Badge' },
  access: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300', label: 'Access' },
  physical: { color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300', label: 'Physical' },
  free: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300', label: 'Free' },
  downloadable: { color: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300', label: 'Download' }
};

const visibilityInfo: Record<RewardVisibility, { color: string, label: string }> = {
  public: { color: 'bg-green-100 text-green-800', label: 'Public' },
  vip: { color: 'bg-purple-100 text-purple-800', label: 'VIP Only' },
  limited: { color: 'bg-amber-100 text-amber-800', label: 'Limited Time' }
};

const RewardsManagement: React.FC = () => {
  const { rewards, addReward, updateReward, deleteReward } = useRewardsAdmin();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReward, setEditingReward] = useState<RewardForm | null>(null);
  const [selectedType, setSelectedType] = useState<RewardType | 'all'>('all');

  const handleEditReward = (reward: Reward) => {
    setEditingReward({
      id: reward.id,
      name: reward.title || reward.name,
      description: reward.description || '',
      imageUrl: reward.imageUrl || reward.image_url,
      pointsCost: reward.pointsCost || reward.points_cost,
      type: (reward.type || reward.reward_type) as RewardType,
      visibility: reward.visibility as RewardVisibility,
      stock: reward.stock || reward.quantity_available,
      expiresAt: reward.expiresAt || reward.expires_at,
      actionUrl: reward.actionUrl,
      isActive: true
    });
    setIsFormOpen(true);
  };

  const handleDuplicateReward = (reward: Reward) => {
    setEditingReward({
      name: `${reward.title || reward.name} (Copy)`,
      description: reward.description || '',
      imageUrl: reward.imageUrl || reward.image_url,
      pointsCost: reward.pointsCost || reward.points_cost,
      type: (reward.type || reward.reward_type) as RewardType,
      visibility: reward.visibility as RewardVisibility,
      stock: reward.stock || reward.quantity_available,
      expiresAt: reward.expiresAt || reward.expires_at,
      actionUrl: reward.actionUrl,
      isActive: true
    });
    setIsFormOpen(true);
  };

  const handleFormSubmit = (formData: RewardForm) => {
    if (formData.id) {
      updateReward(formData.id, {
        title: formData.name,
        name: formData.name,
        description: formData.description,
        imageUrl: formData.imageUrl,
        image_url: formData.imageUrl,
        pointsCost: formData.pointsCost,
        points_cost: formData.pointsCost,
        type: formData.type as any,
        reward_type: formData.type as any,
        visibility: formData.visibility as any,
        stock: formData.stock || null,
        quantity_available: formData.stock || null,
        expiresAt: formData.expiresAt ? 
          (formData.expiresAt instanceof Date ? formData.expiresAt.toISOString() : formData.expiresAt) : null,
        expires_at: formData.expiresAt ? 
          (formData.expiresAt instanceof Date ? formData.expiresAt.toISOString() : formData.expiresAt) : null,
      });
      toast.success('Reward updated successfully');
    } else {
      addReward({
        title: formData.name,
        name: formData.name,
        description: formData.description,
        imageUrl: formData.imageUrl,
        image_url: formData.imageUrl,
        pointsCost: formData.pointsCost,
        points_cost: formData.pointsCost,
        type: formData.type as any,
        reward_type: formData.type as any,
        visibility: formData.visibility as any,
        stock: formData.stock || null,
        quantity_available: formData.stock || null,
        expiresAt: formData.expiresAt ? 
          (formData.expiresAt instanceof Date ? formData.expiresAt.toISOString() : formData.expiresAt) : null,
        expires_at: formData.expiresAt ? 
          (formData.expiresAt instanceof Date ? formData.expiresAt.toISOString() : formData.expiresAt) : null,
      });
      toast.success('New reward created successfully');
    }
    setIsFormOpen(false);
    setEditingReward(null);
  };

  const handleCreateNewReward = () => {
    setEditingReward(null);
    setIsFormOpen(true);
  };

  const filteredRewards = selectedType === 'all' 
    ? rewards 
    : rewards.filter(reward => reward.type === selectedType);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
            <div>
              <CardTitle>Rewards Store</CardTitle>
              <CardDescription>
                Configure rewards that members can redeem with their points
              </CardDescription>
            </div>
            <Button onClick={handleCreateNewReward} className="gap-2 sm:self-end">
              <Plus className="h-4 w-4" />
              Create Reward
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Tabs defaultValue="all" onValueChange={(value) => setSelectedType(value as RewardType | 'all')}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="digital">Digital</TabsTrigger>
                <TabsTrigger value="nft">NFT</TabsTrigger>
                <TabsTrigger value="badge">Badge</TabsTrigger>
                <TabsTrigger value="access">Access</TabsTrigger>
                <TabsTrigger value="physical">Physical</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredRewards.map((reward) => (
                    <RewardCard 
                      key={reward.id}
                      reward={reward}
                      onEdit={() => handleEditReward(reward)}
                      onDuplicate={() => handleDuplicateReward(reward)}
                    />
                  ))}
                </div>
              </TabsContent>

              {Object.keys(rewardTypeInfo).map((type) => (
                <TabsContent key={type} value={type} className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredRewards.map((reward) => (
                      <RewardCard 
                        key={reward.id}
                        reward={reward}
                        onEdit={() => handleEditReward(reward)}
                        onDuplicate={() => handleDuplicateReward(reward)}
                      />
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </CardContent>
      </Card>

      <RewardFormDialog 
        open={isFormOpen} 
        onOpenChange={setIsFormOpen}
        reward={editingReward}
        onSubmit={handleFormSubmit}
      />
    </>
  );
};

interface RewardCardProps {
  reward: Reward;
  onEdit: () => void;
  onDuplicate: () => void;
}

const RewardCard: React.FC<RewardCardProps> = ({ reward, onEdit, onDuplicate }) => {
  return (
    <Card className="overflow-hidden">
      <div 
        className="h-40 bg-center bg-cover"
        style={{ 
          backgroundImage: reward.imageUrl ? `url(${reward.imageUrl})` : 'url("/placeholder.svg")' 
        }}
      />
      <CardContent className="pt-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-lg">{reward.title}</h3>
          <Badge variant="secondary" className={visibilityInfo[reward.visibility as RewardVisibility]?.color}>
            {visibilityInfo[reward.visibility as RewardVisibility]?.label}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline" className={rewardTypeInfo[reward.type]?.color || ''}>
            {rewardTypeInfo[reward.type]?.label || reward.type}
          </Badge>
          {reward.stock !== null && (
            <span className="text-xs text-muted-foreground">
              {reward.stock} left
            </span>
          )}
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {reward.description}
        </p>
        
        <div className="flex justify-between items-center">
          <div>
            <span className="font-bold">{reward.pointsCost}</span>
            <span className="text-muted-foreground"> points</span>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">Actions</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDuplicate}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Archive className="h-4 w-4 mr-2" />
                Archive
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};

export default RewardsManagement;
