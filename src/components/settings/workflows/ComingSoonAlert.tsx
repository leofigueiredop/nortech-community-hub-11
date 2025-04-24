
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
import { Clock } from 'lucide-react';

interface ComingSoonAlertProps {
  isOpen: boolean;
  onClose: () => void;
  onJoinWaitlist: () => void;
}

const ComingSoonAlert: React.FC<ComingSoonAlertProps> = ({
  isOpen,
  onClose,
  onJoinWaitlist
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <div className="mx-auto bg-indigo-100 dark:bg-indigo-900/30 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Clock className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <DialogTitle className="text-center">Custom Workflow Builder Coming Soon</DialogTitle>
          <DialogDescription className="text-center">
            Custom workflow builder is currently in development. Soon you'll be able to create personalized
            onboarding, engagement, and automation flows tailored to your community.
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

export default ComingSoonAlert;
