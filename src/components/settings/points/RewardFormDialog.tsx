import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RewardForm, RewardType, RewardVisibility } from '@/types/points-config';
import { useFormatDate } from '@/utils/i18n/formatters';

interface RewardFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reward: RewardForm | null;
  onSubmit: (data: RewardForm) => void;
}

const RewardFormDialog: React.FC<RewardFormDialogProps> = ({ 
  open, 
  onOpenChange, 
  reward,
  onSubmit 
}) => {
  const [formData, setFormData] = useState<RewardForm>({
    name: '',
    description: '',
    imageUrl: '',
    pointsCost: 100,
    type: 'digital',
    visibility: 'public',
    stock: null,
    expiresAt: null,
    isActive: true
  });

  const [enableStock, setEnableStock] = useState(false);
  const [enableExpiration, setEnableExpiration] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);

  const formatDate = useFormatDate();

  // Reset form when dialog opens/closes or reward changes
  useEffect(() => {
    if (open && reward) {
      setFormData({
        ...reward,
        // Make sure expiresAt is a Date object if it exists
        expiresAt: reward.expiresAt ? 
          (typeof reward.expiresAt === 'string' ? new Date(reward.expiresAt) : reward.expiresAt) 
          : null
      });
      setEnableStock(reward.stock !== null && reward.stock !== undefined);
      setEnableExpiration(!!reward.expiresAt);
      setDate(reward.expiresAt ? 
        (typeof reward.expiresAt === 'string' ? new Date(reward.expiresAt) : reward.expiresAt) 
        : undefined);
    } else if (open) {
      setFormData({
        name: '',
        description: '',
        imageUrl: '',
        pointsCost: 100,
        type: 'digital',
        visibility: 'public',
        stock: null,
        expiresAt: null,
        isActive: true
      });
      setEnableStock(false);
      setEnableExpiration(false);
      setDate(undefined);
    }
  }, [open, reward]);

  // Update form data when user changes inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'pointsCost' || name === 'stock' ? parseInt(value) : value
    }));
  };

  // Update stock based on toggle
  useEffect(() => {
    if (!enableStock) {
      setFormData(prev => ({ ...prev, stock: null }));
    } else if (enableStock && formData.stock === null) {
      setFormData(prev => ({ ...prev, stock: 10 }));
    }
  }, [enableStock]);

  // Update expiration date based on toggle and date picker
  useEffect(() => {
    if (!enableExpiration) {
      setFormData(prev => ({ ...prev, expiresAt: null }));
    } else if (enableExpiration && date) {
      setFormData(prev => ({ ...prev, expiresAt: date }));
    }
  }, [enableExpiration, date]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{reward ? 'Edit Reward' : 'Create New Reward'}</DialogTitle>
            <DialogDescription>
              {reward 
                ? 'Update the details for this reward.' 
                : 'Fill in the details below to create a new reward.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2 col-span-2">
                <Label htmlFor="name">Reward Title</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Premium Course Access"
                  required
                />
              </div>
              
              <div className="grid gap-2 col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe what this reward includes"
                  rows={3}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl || ''}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="pointsCost">Cost in Points</Label>
                <Input
                  id="pointsCost"
                  name="pointsCost"
                  type="number"
                  min={1}
                  value={formData.pointsCost}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="type">Reward Type</Label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="digital">Digital</option>
                  <option value="nft">NFT</option>
                  <option value="badge">Badge</option>
                  <option value="access">Access</option>
                  <option value="physical">Physical</option>
                </select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="visibility">Visibility</Label>
                <select
                  id="visibility"
                  name="visibility"
                  value={formData.visibility}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="public">Public</option>
                  <option value="vip">VIP Only</option>
                  <option value="limited">Limited Time</option>
                </select>
              </div>
              
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="stock">Limited Stock</Label>
                  <Switch
                    id="enable-stock"
                    checked={enableStock}
                    onCheckedChange={setEnableStock}
                  />
                </div>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min={1}
                  value={formData.stock || ''}
                  onChange={handleChange}
                  disabled={!enableStock}
                  placeholder="e.g. 10"
                />
              </div>
              
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="expiresAt">Expiration Date</Label>
                  <Switch
                    id="enable-expiration"
                    checked={enableExpiration}
                    onCheckedChange={setEnableExpiration}
                  />
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                      disabled={!enableExpiration}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? formatDate(date, 'MEDIUM') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="grid gap-2 col-span-2">
                <Label htmlFor="actionUrl">Action URL (Optional)</Label>
                <Input
                  id="actionUrl"
                  name="actionUrl"
                  value={formData.actionUrl || ''}
                  onChange={handleChange}
                  placeholder="e.g. https://example.com/premium"
                />
                <p className="text-xs text-muted-foreground">
                  Users will be directed to this URL after redeeming the reward
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {reward ? 'Update Reward' : 'Create Reward'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RewardFormDialog;
