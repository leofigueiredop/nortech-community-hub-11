import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X, Mail, UserPlus, Shield, Crown, Star } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface InviteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvite: (email: string, role: string, plan: string) => Promise<void>;
}

const InviteMemberDialog: React.FC<InviteMemberDialogProps> = ({
  open,
  onOpenChange,
  onInvite
}) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  const [plan, setPlan] = useState('free');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Call the onInvite prop with email, role, and plan
      await onInvite(email, role, plan);
      
      // Reset form
      setEmail('');
      setRole('member');
      setPlan('free');
      onOpenChange(false);
      
      toast({
        title: "Invitation sent! 📧",
        description: `${email} will receive an invitation email shortly.`,
      });
    } catch (error) {
      toast({
        title: "Failed to send invitation",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEmail('');
    setRole('member');
    setPlan('free');
    onOpenChange(false);
  };

  const getRoleIcon = (roleValue: string) => {
    switch (roleValue) {
      case 'admin':
        return <Crown className="h-4 w-4" />;
      case 'moderator':
        return <Shield className="h-4 w-4" />;
      default:
        return <UserPlus className="h-4 w-4" />;
    }
  };

  const getPlanIcon = (planValue: string) => {
    switch (planValue) {
      case 'premium':
        return <Star className="h-4 w-4 text-purple-500" />;
      case 'pro':
        return <Crown className="h-4 w-4 text-blue-500" />;
      default:
        return <UserPlus className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
              <UserPlus className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">
                Invite New Member
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Send an invitation to join your community
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={handleCancel}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="member@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium flex items-center gap-2">
                {getRoleIcon(role)}
                Role
              </Label>
              <Select value={role} onValueChange={setRole} disabled={isLoading}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member" className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <UserPlus className="h-4 w-4" />
                      Member
                    </div>
                  </SelectItem>
                  <SelectItem value="moderator" className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Moderator
                    </div>
                  </SelectItem>
                  <SelectItem value="admin" className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Crown className="h-4 w-4" />
                      Admin
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="plan" className="text-sm font-medium flex items-center gap-2">
                {getPlanIcon(plan)}
                Plan
              </Label>
              <Select value={plan} onValueChange={setPlan} disabled={isLoading}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free" className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <UserPlus className="h-4 w-4 text-gray-500" />
                      Free
                    </div>
                  </SelectItem>
                  <SelectItem value="premium" className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-purple-500" />
                      Premium
                    </div>
                  </SelectItem>
                  <SelectItem value="pro" className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Crown className="h-4 w-4 text-blue-500" />
                      Pro
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="min-w-[80px]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white min-w-[120px]"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Sending...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Send Invite
                </div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InviteMemberDialog; 