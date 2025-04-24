
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

interface MarketingWaitlistDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onJoinWaitlist: () => void;
}

const MarketingWaitlistDialog: React.FC<MarketingWaitlistDialogProps> = ({
  isOpen,
  onClose,
  onJoinWaitlist
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <div className="mx-auto bg-purple-100 dark:bg-purple-900/30 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Mail className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
          <DialogTitle className="text-center">Email Marketing Features Coming Soon</DialogTitle>
          <DialogDescription className="text-center">
            Advanced email marketing features are currently in development. Soon you'll be able to create 
            sophisticated email campaigns and automations tailored to your community.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
          <Button variant="outline" onClick={onClose} className="sm:flex-1">
            Close
          </Button>
          <Button onClick={onJoinWaitlist} className="sm:flex-1">
            Join Waitlist for Beta
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MarketingWaitlistDialog;
